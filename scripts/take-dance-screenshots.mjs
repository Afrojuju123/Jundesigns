import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const artifactDir = 'C:\\Users\\Nelson\\.gemini\\antigravity\\brain\\8106a0ef-1d7c-4a1e-a052-3155a3eaaeca';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 80);
    });
  });
  await wait(1000);
}

async function run() {
  console.log('Starting Next.js server on 127.0.0.1:3000...');
  const server = spawn('node.exe', ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', '3000'], {
    stdio: 'ignore',
  });

  await wait(3000);

  const userDir = path.join(artifactDir, 'scratch', 'edge-profile-dance-' + Date.now());
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

    // 1. Dance Desktop Screenshot (1280px)
    console.log('Capturing Dance Desktop Screenshot (1280px)...');
    await page.setViewport({ width: 1280, height: 950, deviceScaleFactor: 2 });
    await page.goto('http://127.0.0.1:3000/workshops/traditional-dance', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await wait(1000);

    const desktopPath = path.join(artifactDir, 'dance-desktop-preview.png');
    await page.screenshot({ path: desktopPath });
    console.log('Dance desktop viewport saved:', desktopPath);

    await autoScroll(page);

    const desktopFullPath = path.join(artifactDir, 'dance-desktop-full.png');
    await page.screenshot({ path: desktopFullPath, fullPage: true });
    console.log('Dance desktop full saved:', desktopFullPath);

    // 2. Dance Mobile Screenshot (390px iPhone)
    console.log('Capturing Dance Mobile Screenshot (390px iPhone)...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    await page.goto('http://127.0.0.1:3000/workshops/traditional-dance', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await wait(1000);

    const mobilePath = path.join(artifactDir, 'dance-mobile-preview.png');
    await page.screenshot({ path: mobilePath });
    console.log('Dance mobile viewport saved:', mobilePath);

    await autoScroll(page);

    const mobileFullPath = path.join(artifactDir, 'dance-mobile-full.png');
    await page.screenshot({ path: mobileFullPath, fullPage: true });
    console.log('Dance mobile full saved:', mobileFullPath);

    console.log('All Dance screenshots captured successfully!');
  } finally {
    await browser.close();
    server.kill();
  }
}

run().catch((err) => {
  console.error('Error running dance screenshots:', err);
  process.exit(1);
});
