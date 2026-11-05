import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const artifactDir = 'C:\\Users\\Nelson\\.gemini\\antigravity\\brain\\8106a0ef-1d7c-4a1e-a052-3155a3eaaeca';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const userDir = path.join(artifactDir, 'scratch', 'edge-profile-schools-' + Date.now());
  fs.mkdirSync(userDir, { recursive: true });

  console.log('Launching Edge headless...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    userDataDir: userDir,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
    ],
  });

  try {
    const page = await browser.newPage();

    // 1. Desktop full page & sections (1440x900)
    console.log('Taking Desktop /schools screenshots...');
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3000/schools', { waitUntil: 'networkidle0', timeout: 30000 });
    await wait(1500);

    // Full page screenshot
    await page.screenshot({
      path: path.join(artifactDir, 'schools-desktop-full.png'),
      fullPage: true,
    });
    console.log('Saved schools-desktop-full.png');

    // Hero section
    await page.screenshot({
      path: path.join(artifactDir, 'schools-hero-desktop.png'),
      clip: { x: 0, y: 0, width: 1440, height: 950 },
    });
    console.log('Saved schools-hero-desktop.png');

    // Packages matrix section
    const matrixElem = await page.$('#packages');
    if (matrixElem) {
      await matrixElem.scrollIntoView();
      await wait(500);
      const box = await matrixElem.boundingBox();
      if (box) {
        await page.screenshot({
          path: path.join(artifactDir, 'schools-matrix-desktop.png'),
          clip: {
            x: Math.max(0, box.x - 20),
            y: Math.max(0, box.y - 20),
            width: Math.min(1440, box.width + 40),
            height: box.height + 40,
          },
        });
        console.log('Saved schools-matrix-desktop.png');
      }
    }

    // Estimator section
    const estimatorElem = await page.$('#estimator');
    if (estimatorElem) {
      await estimatorElem.scrollIntoView();
      await wait(500);
      const box = await estimatorElem.boundingBox();
      if (box) {
        await page.screenshot({
          path: path.join(artifactDir, 'schools-estimator-desktop.png'),
          clip: {
            x: Math.max(0, box.x - 20),
            y: Math.max(0, box.y - 20),
            width: Math.min(1440, box.width + 40),
            height: box.height + 40,
          },
        });
        console.log('Saved schools-estimator-desktop.png');
      }
    }

    // 2. Quote stub page
    console.log('Taking /schools/request-quote screenshot...');
    await page.goto('http://localhost:3000/schools/request-quote?students=80&package=silver', {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });
    await wait(1000);
    await page.screenshot({
      path: path.join(artifactDir, 'schools-quote-stub-desktop.png'),
      fullPage: true,
    });
    console.log('Saved schools-quote-stub-desktop.png');

    // 3. Mobile viewport (390x844 - iPhone 14)
    console.log('Taking Mobile screenshots (390x844)...');
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
    await page.goto('http://localhost:3000/schools', { waitUntil: 'networkidle0', timeout: 30000 });
    await wait(1500);

    // Mobile Hero
    await page.screenshot({
      path: path.join(artifactDir, 'schools-hero-mobile.png'),
      clip: { x: 0, y: 0, width: 390, height: 840 },
    });
    console.log('Saved schools-hero-mobile.png');

    // Mobile Packages Accordion
    const mobilePackages = await page.$('#packages');
    if (mobilePackages) {
      await mobilePackages.scrollIntoView();
      await wait(500);
      const box = await mobilePackages.boundingBox();
      if (box) {
        await page.screenshot({
          path: path.join(artifactDir, 'schools-packages-mobile.png'),
          clip: {
            x: Math.max(0, box.x),
            y: Math.max(0, box.y),
            width: 390,
            height: Math.min(844, box.height),
          },
        });
        console.log('Saved schools-packages-mobile.png');
      }
    }

    // Mobile Estimator
    const mobileEstimator = await page.$('#estimator');
    if (mobileEstimator) {
      await mobileEstimator.scrollIntoView();
      await wait(500);
      const box = await mobileEstimator.boundingBox();
      if (box) {
        await page.screenshot({
          path: path.join(artifactDir, 'schools-estimator-mobile.png'),
          clip: {
            x: Math.max(0, box.x),
            y: Math.max(0, box.y),
            width: 390,
            height: Math.min(844, box.height),
          },
        });
        console.log('Saved schools-estimator-mobile.png');
      }
    }

    // 4. Home page callout band
    console.log('Taking Home Page callout band screenshot...');
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
    await wait(1500);

    // Scroll to workshops and then callout
    await page.evaluate(() => {
      const el = document.getElementById('workshops');
      if (el) el.scrollIntoView();
    });
    await wait(500);
    await page.evaluate(() => {
      window.scrollBy(0, 1200);
    });
    await wait(500);
    await page.screenshot({
      path: path.join(artifactDir, 'schools-home-band-desktop.png'),
      clip: { x: 0, y: 300, width: 1440, height: 600 },
    });
    console.log('Saved schools-home-band-desktop.png');

    console.log('All screenshots captured successfully!');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('Error taking screenshots:', err);
  process.exit(1);
});
