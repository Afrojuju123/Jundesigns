import { test, expect } from "@playwright/test";
import { STORE_LINKS_ENABLED } from "../src/content/site";

const publicRoutes = [
  "/",
  "/workshops",
  "/workshops/imigongo-painting",
  "/workshops/traditional-dance",
  "/workshops/hand-weaving",
  "/workshops/igisoro-game",
  "/schools",
  "/schools/request-quote",
  "/booking/cancelled",
  "/company",
  "/contact",
  "/faq",
  "/terms-conditions",
  "/returns-exchanges",
  "/blog",
  "/style-guide",
  "/non-existent-page",
];

test.describe("Universal Header & Footer Verification", () => {
  for (const route of publicRoutes) {
    test(`route ${route} has exactly one universal header and footer`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });

      // 1. Exactly one banner element (Header)
      const banner = page.getByRole("banner");
      await expect(banner).toHaveCount(1);

      // 2. Exactly one footer element
      const footer = page.locator("footer");
      await expect(footer).toHaveCount(1);

      // 3. Primary button ('Book a workshop' or 'Book') is present in banner
      const bookButton = banner.getByRole("button", { name: /book/i });
      await expect(bookButton).toBeVisible();

      // 4. Navigation links match expected list: Workshops, Schools, Store, Custom Orders, Contact
      const expectedNav = ["Workshops", "Schools", "Store", "Custom Orders", "Contact"];
      for (const navText of expectedNav) {
        const navItem = banner.getByText(navText, { exact: false });
        await expect(navItem.first()).toBeVisible();
      }

      // 5. Store and Custom Orders interactive vs disabled behavior based on flag
      if (STORE_LINKS_ENABLED) {
        await expect(banner.locator('a:has-text("Store")')).toHaveCount(1);
        await expect(banner.locator('a:has-text("Custom Orders")')).toHaveCount(1);
      } else {
        const disabledStore = banner.locator('span[aria-disabled="true"]:has-text("Store")');
        await expect(disabledStore.first()).toBeVisible();
        await expect(banner.locator('a:has-text("Store")')).toHaveCount(0);

        const disabledCustom = banner.locator('span[aria-disabled="true"]:has-text("Custom Orders")');
        await expect(disabledCustom.first()).toBeVisible();
        await expect(banner.locator('a:has-text("Custom Orders")')).toHaveCount(0);
      }
    });
  }

  test("admin shell does NOT contain public header or footer", async ({ page }) => {
    await page.goto("/admin", { waitUntil: "domcontentloaded" });

    // Assert that /admin does not render the public site header or footer
    const publicBanner = page.locator('header[role="banner"]');
    await expect(publicBanner).toHaveCount(0);

    const publicFooter = page.locator("footer");
    await expect(publicFooter).toHaveCount(0);
  });
});
