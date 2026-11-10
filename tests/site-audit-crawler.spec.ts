import { test, expect } from "@playwright/test";

const routesToCrawl = [
  "/",
  "/workshops",
  "/workshops/imigongo-painting",
  "/workshops/traditional-dance",
  "/workshops/hand-weaving",
  "/workshops/igisoro-game",
  "/schools",
  "/schools/request-quote",
  "/about",
  "/company",
  "/contact",
  "/faq",
  "/terms-conditions",
  "/returns-exchanges",
  "/blog",
  "/blog/rwandan-barkcloth-heritage-written-in-nature",
  "/blog/imigongo-the-art-of-rwandan-heritage",
  "/style-guide",
  "/booking/cancelled",
];

test.describe("Site-Wide Crawler & Quality Audit", () => {
  for (const route of routesToCrawl) {
    test(`crawls ${route} with 0 console errors, 0 broken images, no horizontal scroll, and exactly 1 header/footer`, async ({
      page,
    }) => {
      const consoleErrors: string[] = [];
      const hydrationWarnings: string[] = [];
      const pageErrors: string[] = [];
      const brokenImages: string[] = [];

      // Monitor console events
      page.on("console", (msg) => {
        const text = msg.text();
        if (msg.type() === "error") {
          consoleErrors.push(text);
        }
        if (
          text.toLowerCase().includes("hydration") ||
          text.toLowerCase().includes("did not match") ||
          text.toLowerCase().includes("prop `dangerouslysetinnerhtml` did not match")
        ) {
          hydrationWarnings.push(text);
        }
      });

      // Monitor uncaught JavaScript exceptions
      page.on("pageerror", (err) => {
        pageErrors.push(err.message);
      });

      // Monitor failed image requests (4xx / 5xx)
      page.on("response", (res) => {
        if (res.request().resourceType() === "image" && res.status() >= 400) {
          brokenImages.push(`${res.url()} (${res.status()})`);
        }
      });

      // Visit route
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });

      // Assert status code is 200 OK (no 4xx or 5xx)
      expect(response).not.toBeNull();
      if (response) {
        expect(response.status()).toBeLessThan(400);
      }

      // Assert exactly 1 Header and 1 Footer
      const banner = page.getByRole("banner");
      await expect(banner).toHaveCount(1);

      const footer = page.locator("footer");
      await expect(footer).toHaveCount(1);

      // Assert no broken image network responses
      expect(
        brokenImages,
        `Broken images detected on ${route}: ${brokenImages.join(", ")}`
      ).toHaveLength(0);

      // Assert no horizontal scrollbar overflow
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(
        hasHorizontalScroll,
        `Page ${route} triggered unwanted horizontal scroll (scrollWidth > innerWidth)`
      ).toBe(false);

      // Assert 0 console errors, 0 hydration warnings, 0 uncaught errors
      expect(
        consoleErrors,
        `Console errors encountered on ${route}: ${consoleErrors.join("; ")}`
      ).toHaveLength(0);

      expect(
        hydrationWarnings,
        `Hydration warnings on ${route}: ${hydrationWarnings.join("; ")}`
      ).toHaveLength(0);

      expect(
        pageErrors,
        `Uncaught page errors on ${route}: ${pageErrors.join("; ")}`
      ).toHaveLength(0);
    });
  }

  test("404 page renders cleanly with header, footer, and no console errors", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      const text = msg.text();
      // Browser reports HTTP 404 in console for the intentionally missing resource
      if (
        msg.type() === "error" &&
        !text.includes("404 (Not Found)")
      ) {
        consoleErrors.push(text);
      }
    });

    const response = await page.goto("/non-existent-page-404-audit", {
      waitUntil: "domcontentloaded",
    });

    expect(response).not.toBeNull();
    if (response) {
      expect(response.status()).toBe(404);
    }

    // Header & Footer on 404
    await expect(page.getByRole("banner")).toHaveCount(1);
    await expect(page.locator("footer")).toHaveCount(1);

    expect(consoleErrors).toHaveLength(0);
  });
});
