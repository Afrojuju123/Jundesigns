import { chromium } from "@playwright/test";
import path from "path";

const ARTIFACT_DIR = "C:/Users/Nelson/.gemini/antigravity/brain/8106a0ef-1d7c-4a1e-a052-3155a3eaaeca";

async function main() {
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

  // 1. Mobile Menu Closed
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "after-mobile-menu-closed.png"),
  });
  console.log("Captured after-mobile-menu-closed.png");

  // 2. Mobile Menu Open
  const hamburger = page.locator('button[aria-controls="mobile-navigation-drawer"]');
  await hamburger.click();
  await page.waitForSelector("#mobile-navigation-drawer", { state: "visible" });

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "after-mobile-menu-open.png"),
  });
  console.log("Captured after-mobile-menu-open.png");

  // 3. Workshops Expanded
  const workshopsAccordionBtn = page.locator('button[aria-controls="mobile-workshops-menu"]');
  await workshopsAccordionBtn.click();
  await page.waitForSelector("#mobile-workshops-menu", { state: "visible" });

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "after-mobile-workshops-expanded.png"),
  });
  console.log("Captured after-mobile-workshops-expanded.png");

  // 4. Disabled Store & Custom Orders close-up
  const drawer = page.locator("#mobile-navigation-drawer");
  await drawer.screenshot({
    path: path.join(ARTIFACT_DIR, "after-mobile-disabled-store.png"),
  });
  console.log("Captured after-mobile-disabled-store.png");

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
