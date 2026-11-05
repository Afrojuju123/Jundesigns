import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const artifactDir = 'C:\\Users\\Nelson\\.gemini\\antigravity\\brain\\8106a0ef-1d7c-4a1e-a052-3155a3eaaeca';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('Starting Next.js server on 127.0.0.1:3000...');
  const server = spawn('node.exe', ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', '3000'], {
    stdio: 'ignore',
  });

  await wait(3000);

  const userDir = path.join(artifactDir, 'scratch', 'edge-profile-booking-' + Date.now());
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

    // -------------------------------------------------------------
    // DESKTOP CAPTURES (1280px x 900px)
    // -------------------------------------------------------------
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });

    // Step 1: Date & Time
    console.log('Capturing Desktop Step 1 (Date & Time)...');
    await page.goto('http://127.0.0.1:3000/workshops/imigongo-painting?book=open&bookingStep=1', {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    });
    await wait(1500);
    const d1Path = path.join(artifactDir, 'booking-step1-desktop.png');
    await page.screenshot({ path: d1Path });
    console.log('Saved:', d1Path);

    // Step 2: Review & Details
    console.log('Capturing Desktop Step 2 (Review & Details)...');
    await page.goto(
      'http://127.0.0.1:3000/workshops/imigongo-painting?book=open&bookingStep=2&bookingWorkshop=imigongo-painting&bookingDate=2026-11-20&bookingSlot=10:00&bookingGuests=2',
      { waitUntil: 'domcontentloaded', timeout: 15000 }
    );
    await wait(1500);

    // Pre-fill form inputs for visual presentation
    await page.evaluate(() => {
      const setVal = (el, val) => {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };
      const nameInput = document.getElementById('guest-name');
      const emailInput = document.getElementById('guest-email');
      const phoneInput = document.getElementById('phone-number');
      if (nameInput) setVal(nameInput, 'Sarah & David Jenkins');
      if (emailInput) setVal(emailInput, 'sarah.jenkins@example.com');
      if (phoneInput) setVal(phoneInput, '780 324 944');
    });
    await wait(500);
    const d2Path = path.join(artifactDir, 'booking-step2-desktop.png');
    await page.screenshot({ path: d2Path });
    console.log('Saved:', d2Path);

    // Create server hold for Step 3 & Step 4
    console.log('Creating hold on server for Step 3 capture...');
    const holdRes = await fetch('http://127.0.0.1:3000/api/booking/hold', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workshopSlug: 'imigongo-painting',
        date: '2026-11-20',
        slot: '10:00',
        guests: 2,
        customerName: 'Sarah & David Jenkins',
        customerEmail: 'sarah.jenkins@example.com',
        customerPhone: '+250 780 324 944',
        customerCountry: '+250',
      }),
    });
    const holdData = await holdRes.json();
    const ref = holdData.booking.reference;

    // Step 3 Desktop: Payment & 10-Minute Hold
    console.log('Capturing Desktop Step 3 (Payment & Hold)...');
    await page.goto(
      `http://127.0.0.1:3000/workshops/imigongo-painting?book=open&bookingStep=3&bookingRef=${ref}&bookingWorkshop=imigongo-painting&bookingDate=2026-11-20&bookingSlot=10:00&bookingGuests=2`,
      { waitUntil: 'domcontentloaded', timeout: 15000 }
    );
    await wait(1800);
    const d3Path = path.join(artifactDir, 'booking-step3-desktop.png');
    await page.screenshot({ path: d3Path });
    console.log('Saved:', d3Path);

    // Confirm booking payment on server for Step 4
    console.log('Confirming payment on server for Step 4 capture...');
    await fetch('http://127.0.0.1:3000/api/booking/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingReference: ref,
        provider: 'card',
        simulatedScenario: 'success',
        idempotencyKey: 'shot-step4-pay',
      }),
    });

    // Step 4 Desktop: Confirmation
    console.log('Capturing Desktop Step 4 (Confirmation)...');
    await page.goto(
      `http://127.0.0.1:3000/workshops/imigongo-painting?book=open&bookingStep=4&bookingRef=${ref}&bookingWorkshop=imigongo-painting&bookingDate=2026-11-20&bookingSlot=10:00&bookingGuests=2`,
      { waitUntil: 'domcontentloaded', timeout: 15000 }
    );
    await wait(1800);
    const d4Path = path.join(artifactDir, 'booking-step4-desktop.png');
    await page.screenshot({ path: d4Path });
    console.log('Saved:', d4Path);

    // -------------------------------------------------------------
    // MOBILE CAPTURES (390px x 844px iPhone)
    // -------------------------------------------------------------
    console.log('Switching to Mobile Viewport (390px)...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });

    // Step 1 Mobile
    console.log('Capturing Mobile Step 1...');
    await page.goto('http://127.0.0.1:3000/workshops/imigongo-painting?book=open&bookingStep=1', {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    });
    await wait(1500);
    const m1Path = path.join(artifactDir, 'booking-step1-mobile.png');
    await page.screenshot({ path: m1Path });
    console.log('Saved:', m1Path);

    // Step 2 Mobile
    console.log('Capturing Mobile Step 2...');
    await page.goto(
      'http://127.0.0.1:3000/workshops/imigongo-painting?book=open&bookingStep=2&bookingWorkshop=imigongo-painting&bookingDate=2026-11-20&bookingSlot=10:00&bookingGuests=2',
      { waitUntil: 'domcontentloaded', timeout: 15000 }
    );
    await wait(1500);
    await page.evaluate(() => {
      const setVal = (el, val) => {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };
      const nameInput = document.getElementById('guest-name');
      const emailInput = document.getElementById('guest-email');
      const phoneInput = document.getElementById('phone-number');
      if (nameInput) setVal(nameInput, 'Sarah & David Jenkins');
      if (emailInput) setVal(emailInput, 'sarah.jenkins@example.com');
      if (phoneInput) setVal(phoneInput, '780 324 944');
    });
    await wait(500);
    const m2Path = path.join(artifactDir, 'booking-step2-mobile.png');
    await page.screenshot({ path: m2Path });
    console.log('Saved:', m2Path);

    // Create a new mobile hold for Step 3 & 4
    const mobHoldRes = await fetch('http://127.0.0.1:3000/api/booking/hold', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workshopSlug: 'imigongo-painting',
        date: '2026-11-20',
        slot: '10:00',
        guests: 2,
        customerName: 'Sarah & David Jenkins',
        customerEmail: 'sarah.jenkins@example.com',
        customerPhone: '+250 780 324 944',
        customerCountry: '+250',
      }),
    });
    const mobHoldData = await mobHoldRes.json();
    const mobRef = mobHoldData.booking.reference;

    // Step 3 Mobile
    console.log('Capturing Mobile Step 3...');
    await page.goto(
      `http://127.0.0.1:3000/workshops/imigongo-painting?book=open&bookingStep=3&bookingRef=${mobRef}&bookingWorkshop=imigongo-painting&bookingDate=2026-11-20&bookingSlot=10:00&bookingGuests=2`,
      { waitUntil: 'domcontentloaded', timeout: 15000 }
    );
    await wait(1800);
    const m3Path = path.join(artifactDir, 'booking-step3-mobile.png');
    await page.screenshot({ path: m3Path });
    console.log('Saved:', m3Path);

    // Confirm mobile payment for Step 4
    await fetch('http://127.0.0.1:3000/api/booking/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingReference: mobRef,
        provider: 'card',
        simulatedScenario: 'success',
        idempotencyKey: 'mob-shot-step4-pay',
      }),
    });

    // Step 4 Mobile
    console.log('Capturing Mobile Step 4...');
    await page.goto(
      `http://127.0.0.1:3000/workshops/imigongo-painting?book=open&bookingStep=4&bookingRef=${mobRef}&bookingWorkshop=imigongo-painting&bookingDate=2026-11-20&bookingSlot=10:00&bookingGuests=2`,
      { waitUntil: 'domcontentloaded', timeout: 15000 }
    );
    await wait(1800);
    const m4Path = path.join(artifactDir, 'booking-step4-mobile.png');
    await page.screenshot({ path: m4Path });
    console.log('Saved:', m4Path);

    console.log('All 8 Booking Flow screenshots captured successfully!');
  } finally {
    await browser.close();
    server.kill();
  }
}

run().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
