import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const artifactDir = 'C:\\Users\\Nelson\\.gemini\\antigravity\\brain\\8106a0ef-1d7c-4a1e-a052-3155a3eaaeca';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function measureCLS() {
  const userDir = path.join(artifactDir, 'scratch', 'edge-profile-cls-' + Date.now());
  fs.mkdirSync(userDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    userDataDir: userDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

    // Enable LayoutShift performance observer before navigating
    await page.evaluateOnNewDocument(() => {
      window.clsScore = 0;
      window.clsEntries = [];
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            window.clsScore += entry.value;
            window.clsEntries.push({
              value: entry.value,
              startTime: entry.startTime,
              sources: (entry.sources || []).map((s) => ({
                node: s.node ? s.node.nodeName : 'unknown',
              })),
            });
          }
        }
      });
      observer.observe({ type: 'layout-shift', buffered: true });
    });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

    // Scroll smoothly down the entire page to record any shifts during interaction/scroll
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 300;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    // Wait a brief moment for any pending layout calculations
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const result = await page.evaluate(() => {
      return {
        clsScore: window.clsScore,
        clsEntries: window.clsEntries,
      };
    });

    console.log('Mobile Cumulative Layout Shift (CLS):', result.clsScore);
    console.log('CLS Detail Entries count:', result.clsEntries.length);
    if (result.clsEntries.length > 0) {
      console.log('Entries:', JSON.stringify(result.clsEntries, null, 2));
    }

    fs.writeFileSync(
      path.join(artifactDir, 'cls-report.json'),
      JSON.stringify(result, null, 2),
      'utf8'
    );

    return result.clsScore;
  } finally {
    await browser.close();
  }
}

measureCLS().catch((err) => {
  console.error(err);
  process.exit(1);
});
