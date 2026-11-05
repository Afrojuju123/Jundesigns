import assert from "node:assert";

const BASE_URL = "http://localhost:3000";

async function runSecurityTests() {
  console.log("Starting Pesapal API 3.0 Security, Tamper & Admin Refund Tests...\n");

  // 1. Create a fresh hold to test security checks
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 5);
  const dateStr = tomorrow.toISOString().split("T")[0];

  const res = await fetch(`${BASE_URL}/api/booking/hold`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      workshopSlug: "hand-weaving",
      date: dateStr,
      slot: "10:00",
      guests: 2,
      customerName: "Amina Mugabo",
      customerEmail: "amina.security@example.com",
      customerPhone: "+250 788 999 111",
      customerCountry: "+250",
      idempotencyKey: `sec-test-${Date.now()}`,
    }),
  });

  const data = await res.json();
  assert.strictEqual(res.status, 201);
  const ref = data.booking.reference;
  console.log(`✅ Hold created: ${ref} (50,000 RWF)`);

  // 2. Tampered IPN with invalid tracking ID
  const invalidIpnRes = await fetch(`${BASE_URL}/api/pesapal/ipn?OrderTrackingId=fake-id-999&OrderMerchantReference=${ref}`);
  const invalidIpnData = await invalidIpnRes.json();
  // IPN should safely acknowledge receipt with 200 without altering booking to paid
  assert.strictEqual(invalidIpnRes.status, 200);
  console.log("✅ Invalid/tampered IPN handled safely without crash");

  // Check booking status remains pending
  const statusRes = await fetch(`${BASE_URL}/api/booking/${ref}/status`);
  const statusData = await statusRes.json();
  assert.notStrictEqual(statusData.status, "paid", "Tampered IPN must not mark booking as paid");
  console.log(`✅ Booking status remained unconfirmed (${statusData.status}) as expected`);

  // 3. Admin Refund Endpoint Protection
  // Try refunding an unpaid booking -> should fail
  const unauthRefundRes = await fetch(`${BASE_URL}/api/admin/bookings/${ref}/refund`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ remarks: "Unauthorized refund test" }),
  });
  // Unauthenticated without admin session cookie must return 401
  assert.strictEqual(unauthRefundRes.status, 401, "Admin refund must require authenticated admin session");
  console.log("✅ Unauthenticated admin refund correctly blocked with 401 Unauthorized");

  // Login as admin
  const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: process.env.ADMIN_PASSWORD || "kigali2026" }),
  });
  assert.strictEqual(loginRes.status, 200);
  const cookieHeader = loginRes.headers.get("set-cookie");
  console.log("✅ Admin logged in successfully");

  // Now attempt refund on unconfirmed booking -> should reject because only paid bookings can be refunded
  const authRefundRes = await fetch(`${BASE_URL}/api/admin/bookings/${ref}/refund`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
    body: JSON.stringify({ remarks: "Attempt refund on unpaid booking" }),
  });
  const authRefundData = await authRefundRes.json();
  assert.strictEqual(authRefundRes.status, 400);
  assert.ok(authRefundData.error.includes("Only paid bookings can be refunded"));
  console.log("✅ Admin refund correctly refused for non-paid booking");

  console.log("\n🎉 ALL SECURITY & ACCESS CONTROL TESTS PASSED!\n");
}

runSecurityTests().catch((err) => {
  console.error("❌ Security test failed:", err);
  process.exit(1);
});
