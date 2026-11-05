import puppeteer from 'puppeteer-core';
import path from 'path';

const artifactDir = 'C:\\Users\\Nelson\\.gemini\\antigravity\\brain\\8106a0ef-1d7c-4a1e-a052-3155a3eaaeca';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

    // 1. Home page callout
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await wait(1000);
    // Find the callout band by heading
    const homeBand = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h3'));
      const target = headings.find(h => h.textContent.includes('Bringing a Class or Group?'));
      if (target) {
        const section = target.closest('section');
        if (section) {
          section.scrollIntoView();
          const rect = section.getBoundingClientRect();
          return { y: window.scrollY + rect.top, height: rect.height };
        }
      }
      return null;
    });

    if (homeBand) {
      await wait(500);
      await page.screenshot({
        path: path.join(artifactDir, 'schools-home-band-desktop.png'),
        clip: { x: 0, y: homeBand.y, width: 1440, height: homeBand.height },
      });
      console.log('Saved schools-home-band-desktop.png');
    }

    // 2. Workshop logistics section
    await page.goto('http://localhost:3000/workshops/imigongo-painting', { waitUntil: 'networkidle0' });
    await wait(1000);
    const logisticsSection = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h2'));
      const target = headings.find(h => h.textContent.includes('Logistics'));
      if (target) {
        const section = target.closest('section');
        if (section) {
          section.scrollIntoView();
          const rect = section.getBoundingClientRect();
          return { y: window.scrollY + rect.top, height: rect.height };
        }
      }
      return null;
    });

    if (logisticsSection) {
      await wait(500);
      await page.screenshot({
        path: path.join(artifactDir, 'schools-workshop-notice-desktop.png'),
        clip: { x: 0, y: logisticsSection.y, width: 1440, height: logisticsSection.height },
      });
      console.log('Saved schools-workshop-notice-desktop.png');
    }

    // 3. Booking drawer prompt when stepper hits max
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await wait(1000);
    // Click book button
    const bookButtons = await page.$$('button');
    for (const b of bookButtons) {
      const txt = await page.evaluate(el => el.textContent, b);
      if (txt && txt.toLowerCase().includes('book a workshop')) {
        await b.click();
        break;
      }
    }
    await wait(800);
    // Click increase guest count up to max (e.g. 8 times)
    for (let i = 0; i < 9; i++) {
      const plusBtn = await page.$('button[aria-label="Increase guest count"]');
      if (plusBtn) {
        const disabled = await page.evaluate(el => el.disabled, plusBtn);
        if (!disabled) {
          await plusBtn.click();
          await wait(100);
        }
      }
    }
    await wait(500);
    const drawer = await page.$('[role="dialog"]');
    if (drawer) {
      await drawer.screenshot({
        path: path.join(artifactDir, 'schools-booking-drawer-prompt-desktop.png'),
      });
      console.log('Saved schools-booking-drawer-prompt-desktop.png');
    }

    console.log('Integration screenshots saved!');
  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
