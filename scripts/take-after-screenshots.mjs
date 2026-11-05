import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const artifactDir = 'C:\\Users\\Nelson\\.gemini\\antigravity\\brain\\8106a0ef-1d7c-4a1e-a052-3155a3eaaeca';
const afterDir = path.join(artifactDir, 'after');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

fs.mkdirSync(afterDir, { recursive: true });

const viewports = [
  { width: 1536, height: 960, isMobile: false, label: '1536' },
  { width: 1280, height: 800, isMobile: false, label: '1280' },
  { width: 1024, height: 768, isMobile: false, label: '1024' },
  { width: 768, height: 1024, isMobile: false, label: '768' },
  { width: 390, height: 844, isMobile: true, label: '390' },
  { width: 360, height: 800, isMobile: true, label: '360' },
];

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  const userDir = path.join(artifactDir, 'scratch', 'edge-profile-after-' + Date.now());
  fs.mkdirSync(userDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    userDataDir: userDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const measurements = [];

  try {
    const page = await browser.newPage();

    for (const vp of viewports) {
      console.log(`\n========================================`);
      console.log(`Capturing AFTER screenshots at ${vp.label}px (${vp.width}x${vp.height})...`);
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2, isMobile: vp.isMobile });

      // 1. Home workshop section
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
      await wait(800);
      const homeWorkshops = await page.$('#workshops');
      if (homeWorkshops) {
        await homeWorkshops.screenshot({
          path: path.join(afterDir, `home-workshops-${vp.label}.png`),
        });
      }

      // Measure Home workshops cards
      const homeCardMetrics = await page.evaluate(() => {
        const section = document.querySelector('#workshops');
        if (!section) return null;
        const cards = Array.from(section.querySelectorAll('article'));
        if (cards.length < 2) return null;
        const rect0 = cards[0].getBoundingClientRect();
        const rect1 = cards[1].getBoundingClientRect();
        const btn0 = cards[0].querySelector('button');
        const btn1 = cards[1].querySelector('button');
        const btn0Rect = btn0 ? btn0.getBoundingClientRect() : null;
        const btn1Rect = btn1 ? btn1.getBoundingClientRect() : null;

        return {
          card0Height: rect0.height,
          card1Height: rect1.height,
          heightDiff: Math.abs(rect0.height - rect1.height),
          card0Top: rect0.top,
          card1Top: rect1.top,
          btn0Bottom: btn0Rect ? btn0Rect.bottom : null,
          btn1Bottom: btn1Rect ? btn1Rect.bottom : null,
          btnBottomDiff: btn0Rect && btn1Rect ? Math.abs(btn0Rect.bottom - btn1Rect.bottom) : null,
        };
      });

      // 1b. Home gallery section
      await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('h2'));
        const h = headings.find((el) => el.textContent.includes('Gallery') || el.textContent.includes('Moments'));
        if (h) {
          const sec = h.closest('section');
          if (sec) {
            sec.setAttribute('data-gallery-target', 'true');
            sec.scrollIntoView();
          }
        }
      });
      await wait(500);
      const gTarget = await page.$('[data-gallery-target="true"]');
      if (gTarget) {
        await gTarget.screenshot({
          path: path.join(afterDir, `home-gallery-${vp.label}.png`),
        });
      }

      // 2. Workshops index
      await page.goto('http://localhost:3000/workshops', { waitUntil: 'networkidle0' });
      await wait(800);
      await page.screenshot({
        path: path.join(afterDir, `workshops-index-${vp.label}.png`),
        clip: { x: 0, y: 0, width: vp.width, height: Math.min(1800, vp.height * 2) },
      });

      // Measure Workshops index cards
      const workshopsIndexMetrics = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('article'));
        if (cards.length < 2) return null;
        const rect0 = cards[0].getBoundingClientRect();
        const rect1 = cards[1].getBoundingClientRect();
        const btn0 = cards[0].querySelector('button');
        const btn1 = cards[1].querySelector('button');
        const btn0Rect = btn0 ? btn0.getBoundingClientRect() : null;
        const btn1Rect = btn1 ? btn1.getBoundingClientRect() : null;

        return {
          card0Height: rect0.height,
          card1Height: rect1.height,
          heightDiff: Math.abs(rect0.height - rect1.height),
          card0Top: rect0.top,
          card1Top: rect1.top,
          btn0Bottom: btn0Rect ? btn0Rect.bottom : null,
          btn1Bottom: btn1Rect ? btn1Rect.bottom : null,
          btnBottomDiff: btn0Rect && btn1Rect ? Math.abs(btn0Rect.bottom - btn1Rect.bottom) : null,
        };
      });

      // 3. Workshop page gallery (Imigongo)
      await page.goto('http://localhost:3000/workshops/imigongo-painting', { waitUntil: 'networkidle0' });
      await wait(800);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await wait(500);
      await page.screenshot({
        path: path.join(afterDir, `workshop-imigongo-${vp.label}.png`),
        clip: { x: 0, y: 300, width: vp.width, height: Math.min(1400, vp.height * 1.5) },
      });

      // 4. Schools page activities
      await page.goto('http://localhost:3000/schools', { waitUntil: 'networkidle0' });
      await wait(800);
      await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('h2'));
        const h = headings.find((el) => el.textContent.includes('What Students'));
        if (h) {
          const sec = h.closest('section');
          if (sec) {
            sec.setAttribute('data-schools-activities', 'true');
          }
        }
      });
      const sAct = await page.$('[data-schools-activities="true"]');
      if (sAct) {
        await sAct.screenshot({
          path: path.join(afterDir, `schools-activities-${vp.label}.png`),
        });
      }

      // Measure Schools activity cards
      const schoolsMetrics = await page.evaluate(() => {
        const section = document.querySelector('[data-schools-activities="true"]');
        if (!section) return null;
        const cards = Array.from(section.querySelectorAll('article'));
        if (cards.length < 2) return null;
        const rect0 = cards[0].getBoundingClientRect();
        const rect1 = cards[1].getBoundingClientRect();

        return {
          card0Height: rect0.height,
          card1Height: rect1.height,
          heightDiff: Math.abs(rect0.height - rect1.height),
          card0Top: rect0.top,
          card1Top: rect1.top,
        };
      });

      measurements.push({
        viewport: vp.label,
        width: vp.width,
        home: homeCardMetrics,
        workshopsIndex: workshopsIndexMetrics,
        schools: schoolsMetrics,
      });
    }

    console.log('\nAll AFTER screenshots captured successfully!');
    console.log('\n--- MEASUREMENT REPORT ---');
    console.log(JSON.stringify(measurements, null, 2));

    fs.writeFileSync(
      path.join(artifactDir, 'measurements.json'),
      JSON.stringify(measurements, null, 2),
      'utf8'
    );
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
