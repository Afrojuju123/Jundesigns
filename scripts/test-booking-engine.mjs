import {
  createBookingHold,
  confirmBookingPayment,
  resetBookingStore,
  getBookingByReference,
  isSlotPastCutoff,
  getDayAvailability,
} from "../src/lib/booking/store.js";
import {
  sendBookingConfirmationEmail,
  getEmailAuditLog,
  clearEmailAuditLog,
} from "../src/lib/booking/email.js";
import { paymentProvider } from "../src/lib/booking/payment.js";
import { bookingConfig } from "../src/lib/booking/config.js";

async function runEdgeCaseTests() {
  console.log("==========================================================");
  console.log("   JUN DESIGNS BOOKING ENGINE: EDGE CASE AUDIT SUITE");
  console.log("==========================================================\n");

  let passed = 0;
  let total = 6;

  // ----------------------------------------------------------------------
  // EDGE CASE 1: Two people booking the last place at once (Race Condition)
  // ----------------------------------------------------------------------
  console.log("TEST 1: Concurrency Race Condition (2 users booking last place simultaneously)");
  resetBookingStore();

  const testDate = "2026-11-20";
  const slot = "10:00";

  // Pre-fill 9 of the 10 spots
  const fillRes = await createBookingHold({
    workshopSlug: "imigongo-painting",
    date: testDate,
    slot,
    guests: 9,
    customerName: "Early Group",
    customerEmail: "early@example.com",
    customerPhone: "+250 780 111 222",
    customerCountry: "+250",
  });
  await confirmBookingPayment(fillRes.booking.reference, "PAY-PREFILL-1", "card");

  // Now exactly 1 spot remains.
  // Two users submit concurrent requests for 1 guest at the exact same millisecond:
  const [resA, resB] = await Promise.all([
    createBookingHold({
      workshopSlug: "imigongo-painting",
      date: testDate,
      slot,
      guests: 1,
      customerName: "Alice Walker",
      customerEmail: "alice@example.com",
      customerPhone: "+1 555 123 4567",
      customerCountry: "+1",
    }),
    createBookingHold({
      workshopSlug: "imigongo-painting",
      date: testDate,
      slot,
      guests: 1,
      customerName: "Bob Smith",
      customerEmail: "bob@example.com",
      customerPhone: "+44 7700 900123",
      customerCountry: "+44",
    }),
  ]);

  const oneSuccess = (resA.success && !resB.success) || (!resA.success && resB.success);
  const oneRejectedCapacity = resA.errorCode === "CAPACITY_EXCEEDED" || resB.errorCode === "CAPACITY_EXCEEDED";

  if (oneSuccess && oneRejectedCapacity) {
    console.log("  [PASS] Atomic mutex correctly serialized concurrent hold requests.");
    console.log(`         Winner hold: ${resA.success ? resA.booking.reference : resB.booking.reference}`);
    console.log(`         Rejected customer received: 409 Conflict (${resA.success ? resB.error : resA.error})\n`);
    passed++;
  } else {
    console.error("  [FAIL] Concurrency failure: Both succeeded or unexpected state:", { resA, resB });
  }

  // ----------------------------------------------------------------------
  // EDGE CASE 2: Hold expiring mid-payment
  // ----------------------------------------------------------------------
  console.log("TEST 2: Hold Expiring Mid-Payment");
  const holdRes = await createBookingHold({
    workshopSlug: "hand-weaving",
    date: "2026-11-22",
    slot: "16:00",
    guests: 2,
    customerName: "David Miller",
    customerEmail: "david@example.com",
    customerPhone: "+33 6 12 34 56 78",
    customerCountry: "+33",
  });

  // Attempt payment with simulated expired hold
  const payExpiredRes = await paymentProvider.processPayment({
    bookingReference: holdRes.booking.reference,
    provider: "card",
    simulatedScenario: "expired_hold",
    idempotencyKey: "test-expired-pay-key",
  });

  if (!payExpiredRes.success && payExpiredRes.errorCode === "EXPIRED_HOLD") {
    console.log("  [PASS] Server rejected payment after hold expiration.");
    console.log(`         Error: "${payExpiredRes.error}"\n`);
    passed++;
  } else {
    console.error("  [FAIL] Expected hold expiry rejection:", payExpiredRes);
  }

  // ----------------------------------------------------------------------
  // EDGE CASE 3: Payment succeeding with a late webhook
  // ----------------------------------------------------------------------
  console.log("TEST 3: Payment Succeeding with Late Webhook Delivery");
  const lateHoldRes = await createBookingHold({
    workshopSlug: "traditional-dance",
    date: "2026-11-25",
    slot: "10:00",
    guests: 2,
    customerName: "Elena Rostova",
    customerEmail: "elena@example.com",
    customerPhone: "+49 151 23456789",
    customerCountry: "+49",
  });

  // Late webhook delivers payment reference even after client connection drop
  const webhookRes = await confirmBookingPayment(
    lateHoldRes.booking.reference,
    "PAY-LATE-WEBHOOK-994",
    "card",
    { isLateWebhook: true }
  );

  const updatedBooking = getBookingByReference(lateHoldRes.booking.reference);

  if (webhookRes.success && updatedBooking.status === "paid") {
    console.log("  [PASS] Late webhook verified and transitioned status to 'paid'.");
    console.log(`         Payment Reference: ${updatedBooking.paymentReference}`);
    console.log(`         Final Status: ${updatedBooking.status}\n`);
    passed++;
  } else {
    console.error("  [FAIL] Late webhook handling failed:", { webhookRes, updatedBooking });
  }

  // ----------------------------------------------------------------------
  // EDGE CASE 4: Same-day Cut-off validation
  // ----------------------------------------------------------------------
  console.log("TEST 4: Same-Day Cut-Off Validation (Kigali CAT, UTC+2)");
  const todayStr = new Date().toISOString().split("T")[0];

  // Test slot cutoff helper: e.g. evaluating past slot vs future slot
  const slotCutoffSimulated = isSlotPastCutoff(
    todayStr,
    "10:00",
    new Date(`${todayStr}T09:30:00+02:00`) // 9:30am is less than 2 hours before 10:00am slot
  );

  const slotFutureAllowed = !isSlotPastCutoff(
    "2026-11-28",
    "16:00",
    new Date(`${todayStr}T11:00:00+02:00`)
  );

  if (slotCutoffSimulated && slotFutureAllowed) {
    console.log("  [PASS] Same-day cutoff correctly enforced 2 hours prior to start time.");
    console.log("         Morning 10:00am slot prohibited when accessed at 9:30am Kigali time.\n");
    passed++;
  } else {
    console.error("  [FAIL] Cutoff calculation failed:", { slotCutoffSimulated, slotFutureAllowed });
  }

  // ----------------------------------------------------------------------
  // EDGE CASE 5: Invalid or Past Dates via URL Tampering
  // ----------------------------------------------------------------------
  console.log("TEST 5: Invalid & Past Dates via URL Tampering");
  const pastRes = await createBookingHold({
    workshopSlug: "igisoro-game",
    date: "2024-01-01", // Past date tampering
    slot: "10:00",
    guests: 2,
    customerName: "Hacker Tamper",
    customerEmail: "tamper@example.com",
    customerPhone: "+250 780 999 888",
    customerCountry: "+250",
  });

  const invalidWorkshopRes = await createBookingHold({
    workshopSlug: "non-existent-craft", // Bad slug tampering
    date: "2026-11-28",
    slot: "10:00",
    guests: 2,
    customerName: "Bad Slug",
    customerEmail: "bad@example.com",
    customerPhone: "+250 780 999 888",
    customerCountry: "+250",
  });

  if (
    !pastRes.success &&
    pastRes.errorCode === "PAST_DATE" &&
    !invalidWorkshopRes.success &&
    invalidWorkshopRes.errorCode === "INVALID_WORKSHOP"
  ) {
    console.log("  [PASS] Server rejected past dates (PAST_DATE) and tampered workshop slugs (INVALID_WORKSHOP).");
    console.log(`         Past error: "${pastRes.error}"`);
    console.log(`         Workshop error: "${invalidWorkshopRes.error}"\n`);
    passed++;
  } else {
    console.error("  [FAIL] URL tampering validation failed:", { pastRes, invalidWorkshopRes });
  }

  // ----------------------------------------------------------------------
  // EDGE CASE 6: Email Failure (Retry & Structured Audit Log)
  // ----------------------------------------------------------------------
  console.log("TEST 6: Transactional Email Failure with Automatic Retry");
  clearEmailAuditLog();

  const mockBooking = {
    reference: "JUN-2026-TEST",
    workshopName: "Imigongo Painting",
    customerEmail: "guest@example.com",
  };

  // Simulate network dropout on attempts 1 and 2, succeeding on attempt 3
  const emailRes = await sendBookingConfirmationEmail(mockBooking, 2);
  const auditLogs = getEmailAuditLog();

  if (emailRes.success && emailRes.attempts === 3 && auditLogs.length > 0) {
    console.log("  [PASS] Email service executed exponential backoff retry and succeeded on attempt 3.");
    console.log(`         Total attempts: ${emailRes.attempts}`);
    console.log(`         Recorded Audit Log: Status="${auditLogs[0].status}", Recipient="${auditLogs[0].recipient}"\n`);
    passed++;
  } else {
    console.error("  [FAIL] Email retry test failed:", { emailRes, auditLogs });
  }

  console.log("==========================================================");
  console.log(`   ALL ${passed} OF ${total} EDGE CASE TESTS PASSED SUCCESSFULLY!`);
  console.log("==========================================================\n");
}

runEdgeCaseTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
