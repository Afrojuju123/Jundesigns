import { test, expect } from "@playwright/test";

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
      await page.goto(route);

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
    });
  }

  test("admin shell does NOT contain public header or footer", async ({ page }) => {
    await page.goto("/admin");

    // Assert that /admin does not render the public site header or footer
    const publicBanner = page.locator('header[role="banner"]');
    await expect(publicBanner).toHaveCount(0);

    const publicFooter = page.locator("footer");
    await expect(publicFooter).toHaveCount(0);
  });
});
