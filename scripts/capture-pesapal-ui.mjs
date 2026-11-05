import puppeteer from "puppeteer-core";
import path from "path";

const BROWSER_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const ARTIFACTS_DIR = "C:\\Users\\Nelson\\.gemini\\antigravity\\brain\\8106a0ef-1d7c-4a1e-a052-3155a3eaaeca";
const BASE_URL = "http://localhost:3000";

async function main() {
  console.log("Launching Edge browser for UI captures...");
  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  try {
    // 1. Create a fresh booking hold so we have a real booking reference and redirect URL
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 3);
    const dateStr = tomorrow.toISOString().split("T")[0];

    const holdRes = await fetch(`${BASE_URL}/api/booking/hold`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workshopSlug: "imigongo-painting",
        date: dateStr,
        slot: "10:00",
        guests: 2,
        customerName: "Camille Laurent",
        customerEmail: "camille.l@example.com",
        customerPhone: "+250 788 123 456",
        customerCountry: "+250",
        note: "Excited for the Imigongo patterns!",
        idempotencyKey: `ui-cap-${Date.now()}`,
      }),
    });
    const holdData = await holdRes.json();
    const ref = holdData.booking.reference;
    console.log(`Created test booking: ${ref}`);

    // --- CAPTURE 1: Desktop Step 3 Payment Drawer ---
    const pageDesktop = await browser.newPage();
    await pageDesktop.setViewport({ width: 1440, height: 900 });
    const targetUrlDesktop = `${BASE_URL}/workshops/imigongo-painting?book=open&bookingStep=3&bookingWorkshop=imigongo-painting&bookingDate=${dateStr}&bookingSlot=10:00&bookingGuests=2&bookingRef=${ref}`;
    console.log(`Navigating desktop to: ${targetUrlDesktop}`);
    await pageDesktop.goto(targetUrlDesktop, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 2000));

    const shot1Path = path.join(ARTIFACTS_DIR, "pesapal-step3-desktop.png");
    await pageDesktop.screenshot({ path: shot1Path, fullPage: false });
    console.log(`Saved: ${shot1Path}`);
    await pageDesktop.close();

    // --- CAPTURE 2: Mobile Step 3 Payment Sheet ---
    const pageMobile = await browser.newPage();
    await pageMobile.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    console.log("Navigating mobile to Step 3...");
    await pageMobile.goto(targetUrlDesktop, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 2000));

    const shot2Path = path.join(ARTIFACTS_DIR, "pesapal-step3-mobile.png");
    await pageMobile.screenshot({ path: shot2Path, fullPage: false });
    console.log(`Saved: ${shot2Path}`);
    await pageMobile.close();

    // --- CAPTURE 3: Payment Cancelled Page ---
    const pageCancelled = await browser.newPage();
    await pageCancelled.setViewport({ width: 1440, height: 900 });
    const cancelUrl = `${BASE_URL}/booking/cancelled?reference=${ref}`;
    console.log(`Navigating to: ${cancelUrl}`);
    await pageCancelled.goto(cancelUrl, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 1000));

    const shot3Path = path.join(ARTIFACTS_DIR, "pesapal-cancelled-desktop.png");
    await pageCancelled.screenshot({ path: shot3Path, fullPage: false });
    console.log(`Saved: ${shot3Path}`);
    await pageCancelled.close();

    // --- CAPTURE 4: Admin Booking Detail with Pesapal Refund Action Card ---
    // Log in as admin first
    const pageAdmin = await browser.newPage();
    await pageAdmin.setViewport({ width: 1440, height: 900 });

    // Login via POST or through UI
    await pageAdmin.goto(`${BASE_URL}/admin`, { waitUntil: "networkidle2" });
    await pageAdmin.type('input[type="password"]', process.env.ADMIN_PASSWORD || "");
    await pageAdmin.click('button[type="submit"]');
    await pageAdmin.waitForNavigation({ waitUntil: "networkidle2" });

    // Mark sample booking or navigate to paid sample
    // JUN-2026-M8K2 is a paid sample
    await pageAdmin.goto(`${BASE_URL}/admin/bookings/JUN-2026-M8K2`, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 1500));

    const shot4Path = path.join(ARTIFACTS_DIR, "pesapal-admin-refund-desktop.png");
    await pageAdmin.screenshot({ path: shot4Path, fullPage: false });
    console.log(`Saved: ${shot4Path}`);
    await pageAdmin.close();

    console.log("All UI screenshots successfully captured!");
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("Screenshot error:", err);
  process.exit(1);
});
