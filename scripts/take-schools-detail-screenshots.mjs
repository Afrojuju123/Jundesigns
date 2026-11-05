import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const artifactDir = 'C:\\Users\\Nelson\\.gemini\\antigravity\\brain\\8106a0ef-1d7c-4a1e-a052-3155a3eaaeca';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const userDir = path.join(artifactDir, 'scratch', 'edge-profile-schools-detail-' + Date.now());
  fs.mkdirSync(userDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    userDataDir: userDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();

    // 1. Desktop Matrix
    await page.setViewport({ width: 1440, height: 1200, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3000/schools', { waitUntil: 'networkidle0' });
    await wait(1000);

    const matrix = await page.$('#packages');
    if (matrix) {
      await matrix.screenshot({
        path: path.join(artifactDir, 'schools-matrix-desktop.png'),
      });
      console.log('Saved schools-matrix-desktop.png');
    }

    const estimator = await page.$('#estimator');
    if (estimator) {
      await estimator.screenshot({
        path: path.join(artifactDir, 'schools-estimator-desktop.png'),
      });
      console.log('Saved schools-estimator-desktop.png');
    }

    // 2. Mobile Views
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
    await page.goto('http://localhost:3000/schools', { waitUntil: 'networkidle0' });
    await wait(1000);

    const mobilePkg = await page.$('#packages');
    if (mobilePkg) {
      await mobilePkg.screenshot({
        path: path.join(artifactDir, 'schools-packages-mobile.png'),
      });
      console.log('Saved schools-packages-mobile.png');
    }

    const mobileEst = await page.$('#estimator');
    if (mobileEst) {
      await mobileEst.screenshot({
        path: path.join(artifactDir, 'schools-estimator-mobile.png'),
      });
      console.log('Saved schools-estimator-mobile.png');
    }

    console.log('Detailed section screenshots saved!');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
