import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const artifactDir = 'C:\\Users\\Nelson\\.gemini\\antigravity\\brain\\8106a0ef-1d7c-4a1e-a052-3155a3eaaeca';
const beforeDir = path.join(artifactDir, 'before');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

fs.mkdirSync(beforeDir, { recursive: true });

const viewports = [
  { width: 1536, height: 960, isMobile: false, label: '1536' },
  { width: 1280, height: 800, isMobile: false, label: '1280' },
  { width: 1024, height: 768, isMobile: false, label: '1024' },
  { width: 768, height: 1024, isMobile: false, label: '768' },
  { width: 390, height: 844, isMobile: true, label: '390' },
  { width: 360, height: 800, isMobile: true, label: '360' },
];

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const userDir = path.join(artifactDir, 'scratch', 'edge-profile-before-' + Date.now());
  fs.mkdirSync(userDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    userDataDir: userDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();

    for (const vp of viewports) {
      console.log(`Capturing BEFORE screenshots at ${vp.label}px...`);
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2, isMobile: vp.isMobile });

      // 1. Home workshop section
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
      await wait(800);
      const homeWorkshops = await page.$('#workshops');
      if (homeWorkshops) {
        await homeWorkshops.screenshot({
          path: path.join(beforeDir, `home-workshops-${vp.label}.png`),
        });
      }

      // 1b. Home gallery section (showing the placeholder slots and orphan)
      const homeGallery = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('h2'));
        const h = headings.find(el => el.textContent.includes('Gallery') || el.textContent.includes('Moments'));
        if (h) {
          const sec = h.closest('section');
          if (sec) return sec.id || 'gallery-section';
        }
        return null;
      });
      // Let's scroll to the gallery on home
      await page.evaluate(() => {
        const slot = Array.from(document.querySelectorAll('*')).find(el => el.textContent && el.textContent.includes('PHOTO SLOT'));
        if (slot) {
          const sec = slot.closest('section');
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
          path: path.join(beforeDir, `home-gallery-${vp.label}.png`),
        });
      }

      // 2. Workshops index
      await page.goto('http://localhost:3000/workshops', { waitUntil: 'networkidle0' });
      await wait(800);
      await page.screenshot({
        path: path.join(beforeDir, `workshops-index-${vp.label}.png`),
        clip: { x: 0, y: 0, width: vp.width, height: Math.min(1800, vp.height * 2) },
      });

      // 3. Workshop page gallery (Imigongo)
      await page.goto('http://localhost:3000/workshops/imigongo-painting', { waitUntil: 'networkidle0' });
      await wait(800);
      // scroll to bottom or other workshops / gallery
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await wait(500);
      await page.screenshot({
        path: path.join(beforeDir, `workshop-imigongo-${vp.label}.png`),
        clip: { x: 0, y: 300, width: vp.width, height: Math.min(1400, vp.height * 1.5) },
      });

      // 4. Schools page
      await page.goto('http://localhost:3000/schools', { waitUntil: 'networkidle0' });
      await wait(800);
      const schoolsActivities = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('h2'));
        const h = headings.find(el => el.textContent.includes('What Students'));
        if (h) {
          const sec = h.closest('section');
          if (sec) {
            sec.setAttribute('data-schools-activities', 'true');
            return true;
          }
        }
        return false;
      });
      const sAct = await page.$('[data-schools-activities="true"]');
      if (sAct) {
        await sAct.screenshot({
          path: path.join(beforeDir, `schools-activities-${vp.label}.png`),
        });
      }
    }

    console.log('All BEFORE screenshots captured successfully!');
  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
