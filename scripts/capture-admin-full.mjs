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
    // --- CAPTURE: Admin Booking Detail Full Page ---
    const pageAdmin = await browser.newPage();
    await pageAdmin.setViewport({ width: 1440, height: 1200 });

    await pageAdmin.goto(`${BASE_URL}/admin`, { waitUntil: "networkidle2" });
    await pageAdmin.type('input[type="password"]', process.env.ADMIN_PASSWORD || "");
    await pageAdmin.click('button[type="submit"]');
    await pageAdmin.waitForNavigation({ waitUntil: "networkidle2" });

    await pageAdmin.goto(`${BASE_URL}/admin/bookings/JUN-2026-M8K2`, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 1000));

    const shotAdminPath = path.join(ARTIFACTS_DIR, "pesapal-admin-refund-desktop.png");
    await pageAdmin.screenshot({ path: shotAdminPath, fullPage: true });
    console.log(`Saved: ${shotAdminPath}`);
    await pageAdmin.close();

  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("Screenshot error:", err);
  process.exit(1);
});
