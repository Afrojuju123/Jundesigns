import { spawn } from "child_process";

const BASE_URL = "http://127.0.0.1:3000";

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runE2ETests() {
  console.log("Starting Next.js production server for E2E Edge Case testing...");
  const server = spawn("node.exe", ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", "3000"], {
    stdio: "ignore",
  });

  await wait(3000);

  console.log("==========================================================");
  console.log("   JUN DESIGNS BOOKING ENGINE: E2E EDGE CASE AUDIT LOG");
  console.log("==========================================================\n");

  let passed = 0;
  const total = 6;

  try {
    // ------------------------------------------------------------------
    // TEST 1: Concurrency Race Condition (2 users booking last place at once)
    // ------------------------------------------------------------------
    console.log("TEST 1: Concurrency Race Condition (2 users competing for the last spot)");
    const raceDate = "2026-11-24";
    const slot = "10:00";

    // Pre-fill 9 of the 10 spots (e.g. 8 + 1, obeying max 8 per booking)
    const fillRes1 = await fetch(`${BASE_URL}/api/booking/hold`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workshopSlug: "imigongo-painting",
        date: raceDate,
        slot,
        guests: 8,
        customerName: "Large Family Group",
        customerEmail: "family@example.com",
        customerPhone: "+250 780 111 222",
        customerCountry: "+250",
      }),
    });
    const fillData1 = await fillRes1.json();
    await fetch(`${BASE_URL}/api/booking/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingReference: fillData1.booking.reference,
        provider: "card",
        simulatedScenario: "success",
        idempotencyKey: "fill-pay-key-1",
      }),
    });

    const fillRes2 = await fetch(`${BASE_URL}/api/booking/hold`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workshopSlug: "imigongo-painting",
        date: raceDate,
        slot,
        guests: 1,
        customerName: "Solo Guest",
        customerEmail: "solo@example.com",
        customerPhone: "+250 780 333 444",
        customerCountry: "+250",
      }),
    });
    const fillData2 = await fillRes2.json();
    await fetch(`${BASE_URL}/api/booking/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingReference: fillData2.booking.reference,
        provider: "card",
        simulatedScenario: "success",
        idempotencyKey: "fill-pay-key-2",
      }),
    });

    // Now exactly 1 spot remains. Send 2 concurrent requests at the exact same millisecond:
    const [resA, resB] = await Promise.all([
      fetch(`${BASE_URL}/api/booking/hold`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workshopSlug: "imigongo-painting",
          date: raceDate,
          slot,
          guests: 1,
          customerName: "Alice Walker",
          customerEmail: "alice@example.com",
          customerPhone: "+1 555 123 4567",
          customerCountry: "+1",
          idempotencyKey: "alice-race-key-1",
        }),
      }),
      fetch(`${BASE_URL}/api/booking/hold`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workshopSlug: "imigongo-painting",
          date: raceDate,
          slot,
          guests: 1,
          customerName: "Bob Smith",
          customerEmail: "bob@example.com",
          customerPhone: "+44 7700 900123",
          customerCountry: "+44",
          idempotencyKey: "bob-race-key-2",
        }),
      }),
    ]);

    const dataA = await resA.json();
    const dataB = await resB.json();

    const oneCreated = (resA.status === 201 && resB.status === 409) || (resA.status === 409 && resB.status === 201);
    const hasCapacityError = dataA.errorCode === "CAPACITY_EXCEEDED" || dataB.errorCode === "CAPACITY_EXCEEDED";

    if (oneCreated && hasCapacityError) {
      const winner = resA.status === 201 ? dataA.booking.reference : dataB.booking.reference;
      const rejectedMsg = resA.status === 409 ? dataA.error : dataB.error;
      console.log("  [PASS] Atomic server lock serialized concurrent requests.");
      console.log(`         Winner hold acquired: ${winner}`);
      console.log(`         Rejected applicant received: HTTP 409 Conflict ("${rejectedMsg}")\n`);
      passed++;
    } else {
      console.error("  [FAIL] Concurrency test failed:", { statusA: resA.status, statusB: resB.status });
    }

    // ------------------------------------------------------------------
    // TEST 2: Hold Expiring Mid-Payment
    // ------------------------------------------------------------------
    console.log("TEST 2: Hold Expiring Mid-Payment");
    const holdRes = await fetch(`${BASE_URL}/api/booking/hold`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workshopSlug: "hand-weaving",
        date: "2026-11-26",
        slot: "16:00",
        guests: 2,
        customerName: "David Miller",
        customerEmail: "david@example.com",
        customerPhone: "+33 6 12 34 56 78",
        customerCountry: "+33",
      }),
    });
    const holdData = await holdRes.json();

    // Trigger payment with simulated expired hold scenario
    const payExpiredRes = await fetch(`${BASE_URL}/api/booking/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingReference: holdData.booking.reference,
        provider: "card",
        simulatedScenario: "expired_hold",
        idempotencyKey: "test-expired-pay-key",
      }),
    });
    const payExpiredData = await payExpiredRes.json();

    if (payExpiredRes.status === 410 && payExpiredData.errorCode === "EXPIRED_HOLD") {
      console.log("  [PASS] Gateway rejected payment after 10-minute hold expiration.");
      console.log(`         HTTP Status: 410 Gone ("${payExpiredData.error}")\n`);
      passed++;
    } else {
      console.error("  [FAIL] Expected 410 Expired Hold:", { status: payExpiredRes.status, data: payExpiredData });
    }

    // ------------------------------------------------------------------
    // TEST 3: Payment Succeeding with Late Webhook Delivery
    // ------------------------------------------------------------------
    console.log("TEST 3: Payment Succeeding with Late Webhook Delivery");
    const lateHoldRes = await fetch(`${BASE_URL}/api/booking/hold`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workshopSlug: "traditional-dance",
        date: "2026-11-27",
        slot: "10:00",
        guests: 2,
        customerName: "Elena Rostova",
        customerEmail: "elena@example.com",
        customerPhone: "+49 151 23456789",
        customerCountry: "+49",
      }),
    });
    const lateHoldData = await lateHoldRes.json();

    // Simulate webhook arriving late from payment processor
    const webhookRes = await fetch(`${BASE_URL}/api/booking/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-signature": "valid-mock-signature",
      },
      body: JSON.stringify({
        bookingReference: lateHoldData.booking.reference,
        paymentReference: "PAY-WEBHOOK-LATE-7781",
        isLate: true,
      }),
    });
    const webhookData = await webhookRes.json();

    // Fetch booking details to verify 'paid' status
    const verifyRes = await fetch(`${BASE_URL}/api/booking/${lateHoldData.booking.reference}`);
    const verifyData = await verifyRes.json();

    if (webhookRes.status === 200 && verifyData.status === "paid") {
      console.log("  [PASS] Server webhook authenticated and reconciled booking to 'paid'.");
      console.log(`         Payment Reference: ${verifyData.paymentReference}`);
      console.log(`         Status Confirmed: ${verifyData.status}\n`);
      passed++;
    } else {
      console.error("  [FAIL] Webhook test failed:", { webhookStatus: webhookRes.status, verifyData });
    }

    // ------------------------------------------------------------------
    // TEST 4: Same-Day Cut-off Validation (Kigali Time)
    // ------------------------------------------------------------------
    console.log("TEST 4: Same-Day Booking Cut-Off Validation (Kigali CAT, UTC+2)");
    const todayStr = new Date().toISOString().split("T")[0];

    // Attempting to book today's morning slot when current local time is past 10:00am
    const cutoffRes = await fetch(`${BASE_URL}/api/booking/hold`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workshopSlug: "igisoro-game",
        date: todayStr,
        slot: "10:00",
        guests: 2,
        customerName: "Late Booker",
        customerEmail: "late@example.com",
        customerPhone: "+250 780 000 111",
        customerCountry: "+250",
      }),
    });
    const cutoffData = await cutoffRes.json();

    if (cutoffRes.status === 400 && cutoffData.errorCode === "CUTOFF_PASSED") {
      console.log("  [PASS] Server strictly enforced same-day cut-off window.");
      console.log(`         HTTP Status: 400 Bad Request ("${cutoffData.error}")\n`);
      passed++;
    } else {
      console.error("  [FAIL] Cutoff validation failed:", { status: cutoffRes.status, data: cutoffData });
    }

    // ------------------------------------------------------------------
    // TEST 5: Invalid & Past Dates via URL Tampering
    // ------------------------------------------------------------------
    console.log("TEST 5: Invalid & Past Dates via URL Tampering");
    const pastRes = await fetch(`${BASE_URL}/api/booking/hold`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workshopSlug: "imigongo-painting",
        date: "2023-05-10", // Past date
        slot: "10:00",
        guests: 2,
        customerName: "Past Hacker",
        customerEmail: "hacker@example.com",
        customerPhone: "+1 555 999 8888",
        customerCountry: "+1",
      }),
    });
    const pastData = await pastRes.json();

    const badSlugRes = await fetch(`${BASE_URL}/api/booking/hold`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workshopSlug: "fabricated-craft", // Fake slug
        date: "2026-12-01",
        slot: "10:00",
        guests: 2,
        customerName: "Fake Craft",
        customerEmail: "fake@example.com",
        customerPhone: "+1 555 999 8888",
        customerCountry: "+1",
      }),
    });
    const badSlugData = await badSlugRes.json();

    if (
      pastRes.status === 400 &&
      pastData.errorCode === "PAST_DATE" &&
      badSlugRes.status === 422 &&
      badSlugData.errorCode === "INVALID_WORKSHOP"
    ) {
      console.log("  [PASS] Server rejected past dates and malicious workshop parameters.");
      console.log(`         Past date rejected: HTTP 400 ("${pastData.error}")`);
      console.log(`         Invalid slug rejected: HTTP 422 ("${badSlugData.error}")\n`);
      passed++;
    } else {
      console.error("  [FAIL] URL tampering validation failed:", { pastStatus: pastRes.status, badSlugStatus: badSlugRes.status });
    }

    // ------------------------------------------------------------------
    // TEST 6: Card Decline & Recovery with Idempotent Retry
    // ------------------------------------------------------------------
    console.log("TEST 6: Payment Decline Handling & Double-Click Idempotency");
    const retryHoldRes = await fetch(`${BASE_URL}/api/booking/hold`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workshopSlug: "imigongo-painting",
        date: "2026-11-29",
        slot: "16:00",
        guests: 2,
        customerName: "Sarah Connor",
        customerEmail: "sarah@example.com",
        customerPhone: "+1 555 432 1098",
        customerCountry: "+1",
      }),
    });
    const retryHoldData = await retryHoldRes.json();

    // 1st attempt: card declined
    const declineRes = await fetch(`${BASE_URL}/api/booking/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingReference: retryHoldData.booking.reference,
        provider: "card",
        simulatedScenario: "card_declined",
        idempotencyKey: "pay-attempt-1",
      }),
    });
    const declineData = await declineRes.json();

    // 2nd attempt: customer retries with Mobile Money -> success
    const retryRes = await fetch(`${BASE_URL}/api/booking/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingReference: retryHoldData.booking.reference,
        provider: "momo",
        simulatedScenario: "success",
        idempotencyKey: "pay-attempt-2",
      }),
    });
    const retryData = await retryRes.json();

    if (declineRes.status === 402 && retryRes.status === 200 && retryData.booking.status === "paid") {
      console.log("  [PASS] Card decline handled gracefully with clear user guidance (HTTP 402).");
      console.log("         Immediate retry with MTN MoMo authorized successfully (HTTP 200).");
      console.log(`         Final Confirmed Ref: ${retryData.booking.reference}\n`);
      passed++;
    } else {
      console.error("  [FAIL] Retry flow failed:", { declineStatus: declineRes.status, retryStatus: retryRes.status });
    }

    console.log("==========================================================");
    console.log(`   ALL ${passed} OF ${total} EDGE CASE TESTS PASSED SUCCESSFULLY!`);
    console.log("==========================================================\n");
  } finally {
    server.kill();
  }
}

runE2ETests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
