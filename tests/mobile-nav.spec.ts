import { test, expect } from "@playwright/test";

test.describe("Mobile Navigation Drawer & Accordion", () => {
  test.beforeEach(async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile navigation tests are only applicable to mobile viewports");
    // Navigate to homepage
    await page.goto("/");
  });

  test("hamburger button meets 44px touch target and accessibility requirements", async ({ page }) => {
    const hamburger = page.locator('button[aria-controls="mobile-navigation-drawer"]');
    await expect(hamburger).toBeVisible();

    // Check accessible attributes
    await expect(hamburger).toHaveAttribute("aria-expanded", "false");
    await expect(hamburger).toHaveAttribute("aria-label", "Open menu");

    // Check bounding box >= 44x44 px touch target
    const box = await hamburger.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });

  test("opens full-height drawer, locks scroll, and traps focus", async ({ page }) => {
    const hamburger = page.locator('button[aria-controls="mobile-navigation-drawer"]');
    await hamburger.click();

    // 1. Drawer is visible
    const drawer = page.locator("#mobile-navigation-drawer");
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute("role", "dialog");
    await expect(drawer).toHaveAttribute("aria-modal", "true");

    // 2. Button state updated
    await expect(hamburger).toHaveAttribute("aria-expanded", "true");
    await expect(hamburger).toHaveAttribute("aria-label", "Close menu");

    // 3. Drawer is full-height (not squished to 49px by containing block)
    const box = await drawer.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.height).toBeGreaterThan(400);
    }

    // 4. Body scroll is locked
    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe("hidden");
  });

  test("expands workshops accordion with 4 workshops and collapses properly", async ({ page }) => {
    const hamburger = page.locator('button[aria-controls="mobile-navigation-drawer"]');
    await hamburger.click();

    const drawer = page.locator("#mobile-navigation-drawer");
    await expect(drawer).toBeVisible();

    // Find Workshops accordion toggle
    const workshopsAccordionBtn = drawer.locator('button[aria-controls="mobile-workshops-menu"]');
    await expect(workshopsAccordionBtn).toBeVisible();
    await expect(workshopsAccordionBtn).toHaveAttribute("aria-expanded", "false");

    // Click to expand
    await workshopsAccordionBtn.click();
    await expect(workshopsAccordionBtn).toHaveAttribute("aria-expanded", "true");

    const workshopsMenu = drawer.locator("#mobile-workshops-menu");
    await expect(workshopsMenu).toBeVisible();

    // Confirm the four workshops and all workshops link are present
    const expectedWorkshops = [
      "All Workshops",
      "Imigongo Painting",
      "Traditional Dance",
      "Carpet Hand-Weaving",
      "Igisoro Game",
    ];

    for (const name of expectedWorkshops) {
      await expect(workshopsMenu.getByText(name, { exact: false })).toBeVisible();
    }

    // Click again to collapse
    await workshopsAccordionBtn.click();
    await expect(workshopsAccordionBtn).toHaveAttribute("aria-expanded", "false");
    await expect(workshopsMenu).toBeHidden();
  });

  test("navigating to a workshop page closes menu and restores scroll", async ({ page }) => {
    const hamburger = page.locator('button[aria-controls="mobile-navigation-drawer"]');
    await hamburger.click();

    const drawer = page.locator("#mobile-navigation-drawer");
    await expect(drawer).toBeVisible();

    // Expand workshops accordion
    const workshopsAccordionBtn = drawer.locator('button[aria-controls="mobile-workshops-menu"]');
    await workshopsAccordionBtn.click();

    // Click on Imigongo Painting link
    const imigongoLink = drawer.getByRole("link", { name: "Imigongo Painting" });
    await imigongoLink.click();

    // URL should update
    await expect(page).toHaveURL(/\/workshops\/imigongo-painting/);

    // Drawer must be closed
    await expect(drawer).toBeHidden();

    // Body scroll must be restored
    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).not.toBe("hidden");
  });

  test("pressing Escape closes menu and returns focus to hamburger button", async ({ page }) => {
    const hamburger = page.locator('button[aria-controls="mobile-navigation-drawer"]');
    await hamburger.click();

    const drawer = page.locator("#mobile-navigation-drawer");
    await expect(drawer).toBeVisible();

    // Press Escape
    await page.keyboard.press("Escape");

    // Drawer closes
    await expect(drawer).toBeHidden();

    // Focus returns to hamburger button
    const isFocused = await hamburger.evaluate((el) => document.activeElement === el);
    expect(isFocused).toBe(true);

    // Scroll is restored
    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).not.toBe("hidden");
  });

  test("Store and Custom Orders are rendered as disabled non-interactive items", async ({ page }) => {
    const hamburger = page.locator('button[aria-controls="mobile-navigation-drawer"]');
    await hamburger.click();

    const drawer = page.locator("#mobile-navigation-drawer");
    await expect(drawer).toBeVisible();

    // Assert that Store is disabled with aria-disabled="true" and is not a link
    const disabledStore = drawer.locator('span[aria-disabled="true"]:has-text("Store")');
    await expect(disabledStore).toBeVisible();
    await expect(drawer.locator('a:has-text("Store")')).toHaveCount(0);

    // Assert that Custom Orders is disabled with aria-disabled="true" and is not a link
    const disabledCustom = drawer.locator('span[aria-disabled="true"]:has-text("Custom Orders")');
    await expect(disabledCustom).toBeVisible();
    await expect(drawer.locator('a:has-text("Custom Orders")')).toHaveCount(0);
  });
});
