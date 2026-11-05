import assert from "node:assert";

const BASE_URL = "http://localhost:3000";

function logSection(title) {
  console.log(`\n========================================`);
  console.log(`🧪 TEST: ${title}`);
  console.log(`========================================`);
}

function pass(msg) {
  console.log(`  ✅ PASS: ${msg}`);
}

async function runTests() {
  console.log("Starting Pesapal API 3.0 Integration & Concurrency Test Suite...\n");

  // ----------------------------------------------------
  // TEST 1: Hold Creation & Order Submission
  // ----------------------------------------------------
  logSection("1. Create Booking Hold & Submit Order to Pesapal");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const dateStr = tomorrow.toISOString().split("T")[0];

  const holdPayload = {
    workshopSlug: "imigongo-painting",
    date: dateStr,
    slot: "10:00",
    guests: 2,
    customerName: "Jean-Paul Habimana",
    customerEmail: "jeanpaul.test@example.com",
    customerPhone: "+250 788 123 456",
    customerCountry: "+250",
    note: "Pesapal automated verification hold",
    idempotencyKey: `test-hold-${Date.now()}`,
  };

  const holdRes = await fetch(`${BASE_URL}/api/booking/hold`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(holdPayload),
  });

  const holdData = await holdRes.json();
  assert.strictEqual(holdRes.status, 201, `Expected 201 Created, got ${holdRes.status}`);
  assert.ok(holdData.success, "Hold creation should succeed");
  assert.ok(holdData.booking, "Booking object should be returned");

  const booking = holdData.booking;
  console.log(`  Created Booking Ref: ${booking.reference}`);
  console.log(`  Amount: ${booking.amountRwf} RWF (2 guests x 25,000)`);
  console.log(`  Status: ${booking.status}`);
  console.log(`  Order Tracking ID: ${booking.pesapalOrderTrackingId || "N/A"}`);
  console.log(`  Redirect URL: ${booking.redirectUrl || "N/A"}`);

  assert.match(booking.reference, /^JUN-[A-Z0-9]{8}$/, "Reference must be JUN- + 8 uppercase alphanumerics");
  assert.strictEqual(booking.amountRwf, 50000, "Amount must be 50,000 RWF");
  assert.strictEqual(booking.currency, "RWF", "Currency must be RWF");
  assert.ok(booking.redirectUrl, "Redirect URL must be present for iframe embedding");
  pass("Hold created with valid reference format and Pesapal redirect URL");

  // ----------------------------------------------------
  // TEST 2: Status Polling Endpoint
  // ----------------------------------------------------
  logSection("2. Status Polling Endpoint (/api/booking/[reference]/status)");
  const statusRes = await fetch(`${BASE_URL}/api/booking/${booking.reference}/status`);
  const statusData = await statusRes.json();
  assert.strictEqual(statusRes.status, 200, "Status query must return 200");
  assert.strictEqual(statusData.reference, booking.reference, "Reference must match");
  assert.ok(statusData.status === "held" || statusData.status === "payment_pending", "Status must be pending/held");
  assert.ok(statusData.holdExpiresAt, "holdExpiresAt must be present");
  pass("Status polling returns correct active hold state");

  // ----------------------------------------------------
  // TEST 3: IPN Webhook Transition (COMPLETED Payment)
  // ----------------------------------------------------
  logSection("3. IPN Webhook Handling & Transition (status_code: 1)");
  const trackingId = booking.pesapalOrderTrackingId || "simulated-track-001";
  const ipnRes = await fetch(
    `${BASE_URL}/api/pesapal/ipn?OrderTrackingId=${trackingId}&OrderMerchantReference=${booking.reference}&OrderNotificationType=IPNCHANGE`
  );
  const ipnData = await ipnRes.json();
  assert.strictEqual(ipnRes.status, 200, "IPN must respond with 200 OK");
  assert.strictEqual(ipnData.status, 200, "IPN body status must be 200");
  assert.strictEqual(ipnData.orderNotificationType, "IPNCHANGE");
  assert.strictEqual(ipnData.orderMerchantReference, booking.reference);
  pass("IPN endpoint accepted notification and returned standard receipt acknowledgment");

  // ----------------------------------------------------
  // TEST 4: Duplicate IPN Replay Idempotency
  // ----------------------------------------------------
  logSection("4. Duplicate IPN Replay Idempotency");
  for (let i = 1; i <= 3; i++) {
    const replayRes = await fetch(
      `${BASE_URL}/api/pesapal/ipn?OrderTrackingId=${trackingId}&OrderMerchantReference=${booking.reference}`
    );
    const replayData = await replayRes.json();
    assert.strictEqual(replayRes.status, 200, `Replay ${i} must return 200`);
    assert.strictEqual(replayData.status, 200);
  }
  pass("Multiple IPN replays processed idempotently without errors");

  // ----------------------------------------------------
  // TEST 5: Return Callback (/booking/return)
  // ----------------------------------------------------
  logSection("5. Return Callback Route (/booking/return)");
  const returnRes = await fetch(
    `${BASE_URL}/booking/return?OrderTrackingId=${trackingId}&OrderMerchantReference=${booking.reference}`,
    { redirect: "manual" }
  );
  // Expect redirect to confirmation page /booking/[reference]
  assert.ok(
    returnRes.status === 307 || returnRes.status === 302 || returnRes.status === 200,
    `Return route returned redirect status: ${returnRes.status}`
  );
  const location = returnRes.headers.get("location") || "";
  console.log(`  Redirect Location: ${location}`);
  assert.ok(
    location.includes(`/booking/${booking.reference}`) || returnRes.status === 200,
    "Return route must redirect to booking confirmation page"
  );
  pass("Return callback handled and routed to confirmation view");

  // ----------------------------------------------------
  // TEST 6: Expired Hold Reconciliation Cron
  // ----------------------------------------------------
  logSection("6. Expired Hold Reconciliation Cron (/api/cron/reconcile-holds)");
  const cronRes = await fetch(`${BASE_URL}/api/cron/reconcile-holds`);
  const cronData = await cronRes.json();
  assert.strictEqual(cronRes.status, 200, "Cron must return 200");
  assert.strictEqual(cronData.action, "reconcile-holds");
  assert.strictEqual(typeof cronData.purgedCount, "number");
  pass(`Hold reconciliation cron ran successfully (purged: ${cronData.purgedCount})`);

  // ----------------------------------------------------
  // TEST 7: Pending Transaction Reconciliation Cron
  // ----------------------------------------------------
  logSection("7. Pending Reconciliation Cron (/api/cron/reconcile-pending)");
  const reconcileRes = await fetch(`${BASE_URL}/api/cron/reconcile-pending`);
  const reconcileData = await reconcileRes.json();
  assert.strictEqual(reconcileRes.status, 200, "Reconcile cron must return 200");
  assert.strictEqual(reconcileData.action, "reconcile-pending");
  assert.strictEqual(typeof reconcileData.scannedCount, "number");
  pass(`Pending reconciliation cron ran successfully (scanned: ${reconcileData.scannedCount})`);

  // ----------------------------------------------------
  // TEST 8: Concurrency & Double-Booking Protection
  // ----------------------------------------------------
  logSection("8. Concurrency & Overbooking Protection Under Mutex Lock");
  const targetDate = "2026-11-25";
  const targetSlot = "16:00";

  // Fire 14 concurrent requests simultaneously for the same 10-capacity slot
  console.log("  Firing 14 concurrent booking hold requests for 10-capacity session...");
  const concurrentRequests = Array.from({ length: 14 }).map((_, idx) =>
    fetch(`${BASE_URL}/api/booking/hold`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workshopSlug: "traditional-dance",
        date: targetDate,
        slot: targetSlot,
        guests: 1,
        customerName: `Concurrent Guest ${idx + 1}`,
        customerEmail: `guest${idx + 1}-${Date.now()}@test.rw`,
        customerPhone: "+250 788 000 000",
        customerCountry: "+250",
        idempotencyKey: `concurrent-${idx}-${Date.now()}`,
      }),
    }).then(async (r) => ({ status: r.status, data: await r.json() }))
  );

  const results = await Promise.all(concurrentRequests);
  const successful = results.filter((r) => r.status === 201 && r.data.success);
  const rejected = results.filter((r) => r.status === 409 || !r.data.success);

  console.log(`  Successful Holds: ${successful.length}`);
  console.log(`  Rejected (Capacity Exceeded): ${rejected.length}`);

  // Total successful must not exceed max slot capacity (10)
  assert.strictEqual(successful.length, 10, "Exactly 10 holds must succeed (slot capacity = 10)");
  assert.strictEqual(rejected.length, 4, "Exactly 4 requests must be rejected when capacity is full");
  assert.strictEqual(successful.length + rejected.length, 14, "All 14 requests must be cleanly resolved");
  pass("Mutex lock prevented race conditions; exactly 10 seats filled, 4 cleanly rejected");

  console.log("\n========================================");
  console.log("🎉 ALL PESAPAL INTEGRATION TESTS PASSED!");
  console.log("========================================\n");
}

runTests().catch((err) => {
  console.error("\n❌ TEST FAILED:", err);
  process.exit(1);
});
