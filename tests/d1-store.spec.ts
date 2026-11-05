/**
 * Cloudflare D1 Store Unit & Integration Tests (Playwright runner)
 */

import { test, expect } from "@playwright/test";
import {
  getDayAvailability,
  createBookingHold,
  confirmBookingPayment,
  getBookingByReference,
  getAllBookings,
  toggleBlockedDate,
  resetBookingStore,
} from "@/lib/booking/store";

test.describe("Cloudflare D1 Store Integration Tests", () => {
  test.beforeAll(async () => {
    await resetBookingStore();
  });

  test("calculates day availability correctly for future dates", async () => {
    const testDate = "2026-11-20";
    const avail = await getDayAvailability("imigongo-painting", testDate);

    expect(avail.hasSpace).toBe(true);
    expect(avail.slots.length).toBe(2);
    expect(avail.slots[0].slot).toBe("10:00");
    expect(avail.slots[1].slot).toBe("16:00");
    expect(avail.slots[0].remainingPlaces).toBeGreaterThanOrEqual(8);
  });

  test("creates a booking hold and decrements remaining places atomically", async () => {
    const testDate = "2026-11-20";
    const initialAvail = await getDayAvailability("imigongo-painting", testDate);
    const initialRemaining = initialAvail.slots[0].remainingPlaces;

    const holdRes = await createBookingHold({
      workshopSlug: "imigongo-painting",
      date: testDate,
      slot: "10:00",
      guests: 2,
      customerName: "Amina Umutoni",
      customerEmail: "amina@example.rw",
      customerPhone: "788 123 456",
      customerCountry: "+250",
      idempotencyKey: "test-playwright-idem-1",
    });

    expect(holdRes.success).toBe(true);
    expect(holdRes.booking?.reference).toMatch(/^JUN-\d{4}-[A-Z0-9]{4}$/);
    expect(holdRes.booking?.guests).toBe(2);

    const afterAvail = await getDayAvailability("imigongo-painting", testDate);
    expect(afterAvail.slots[0].remainingPlaces).toBe(initialRemaining - 2);
    expect(afterAvail.slots[0].heldCount).toBe(2);
  });

  test("idempotently handles duplicate hold requests", async () => {
    const testDate = "2026-11-20";
    const key = "test-playwright-idem-repeat";

    const res1 = await createBookingHold({
      workshopSlug: "imigongo-painting",
      date: testDate,
      slot: "16:00",
      guests: 3,
      customerName: "Jean Paul",
      customerEmail: "jean@example.rw",
      customerPhone: "788 333 444",
      customerCountry: "+250",
      idempotencyKey: key,
    });

    const res2 = await createBookingHold({
      workshopSlug: "imigongo-painting",
      date: testDate,
      slot: "16:00",
      guests: 3,
      customerName: "Jean Paul",
      customerEmail: "jean@example.rw",
      customerPhone: "788 333 444",
      customerCountry: "+250",
      idempotencyKey: key,
    });

    expect(res1.success).toBe(true);
    expect(res2.success).toBe(true);
    expect(res1.booking?.reference).toBe(res2.booking?.reference);
  });

  test("rejects holds that exceed available slot capacity", async () => {
    const testDate = "2026-11-20";
    const overflowRes = await createBookingHold({
      workshopSlug: "imigongo-painting",
      date: testDate,
      slot: "10:00",
      guests: 8,
      customerName: "Large Group",
      customerEmail: "group@example.rw",
      customerPhone: "788 999 888",
      customerCountry: "+250",
    });

    expect(overflowRes.success).toBe(false);
    expect(overflowRes.errorCode).toBe("CAPACITY_EXCEEDED");
  });

  test("confirms booking payment and updates status to paid", async () => {
    const testDate = "2026-11-21";
    const holdRes = await createBookingHold({
      workshopSlug: "hand-weaving",
      date: testDate,
      slot: "10:00",
      guests: 2,
      customerName: "Claire Dupont",
      customerEmail: "claire@example.fr",
      customerPhone: "612 345 678",
      customerCountry: "+33",
    });

    expect(holdRes.success).toBe(true);
    const ref = holdRes.booking!.reference;

    const payRes = await confirmBookingPayment(ref, "PAY-MOCK-TEST-123", "card");
    expect(payRes.success).toBe(true);
    expect(payRes.booking?.status).toBe("paid");

    const fetched = await getBookingByReference(ref);
    expect(fetched?.status).toBe("paid");
    expect(fetched?.paymentReference).toBe("PAY-MOCK-TEST-123");
  });

  test("admin toggleBlockedDate immediately updates availability", async () => {
    const testDate = "2026-11-25";

    // Block the date
    await toggleBlockedDate(testDate, true);
    const blockedAvail = await getDayAvailability("imigongo-painting", testDate);
    expect(blockedAvail.isBlocked).toBe(true);
    expect(blockedAvail.slots[0].isAvailable).toBe(false);
    expect(blockedAvail.slots[1].isAvailable).toBe(false);

    // Unblock the date
    await toggleBlockedDate(testDate, false);
    const unblockedAvail = await getDayAvailability("imigongo-painting", testDate);
    expect(unblockedAvail.isBlocked).toBe(false);
  });

  test("getAllBookings returns persistent records from D1", async () => {
    const all = await getAllBookings();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBeGreaterThan(0);
  });
});
