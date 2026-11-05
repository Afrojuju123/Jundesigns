# Pesapal API 3.0 Production Go-Live Checklist

This guide details the exact steps required to transition Jun Designs LTD from the Pesapal Sandbox testing environment to the live production gateway.

---

## 1. Prerequisites & Account Verification

1. **Pesapal Live Merchant Account**:
   - Register and complete KYB verification at [Pesapal Rwanda](https://www.pesapal.com/).
   - Ensure the merchant account is authorized for Rwandan Francs (**RWF**) collection via:
     - Visa / Mastercard / American Express
     - MTN Mobile Money (MoMo Rwanda)
     - Airtel Money Rwanda
2. **Retrieve Production API Credentials**:
   - Log in to the [Pesapal Merchant Portal](https://pay.pesapal.com/).
   - Navigate to **Settings** &rarr; **API 3.0 Credentials**.
   - Copy your live **Consumer Key** and **Consumer Secret**.
   - *Never commit these keys or expose them in client-side code.*

---

## 2. Server Environment Configuration

Update your production deployment environment variables (e.g. Vercel, Railway, Docker, or Linux systemd `.env`):

```bash
# Gateway Environment Mode
PESAPAL_ENV=live

# Live Production API 3.0 Credentials
PESAPAL_CONSUMER_KEY=<your-live-consumer-key>
PESAPAL_CONSUMER_SECRET=<your-live-consumer-secret>

# Public Canonical URL (Must be publicly accessible with HTTPS)
APP_URL=https://jundesigns.rw

# Cron & Admin Security
CRON_SECRET=<generate-secure-random-token-e.g.-openssl-rand-hex-32>
ADMIN_PASSWORD=<strong-random-studio-admin-password>
```

> [!IMPORTANT]
> Do NOT set `PESAPAL_IPN_ID` manually yet. Proceed to Step 3 to register your live IPN endpoint with Pesapal API 3.0.

---

## 3. Register Production IPN (Instant Payment Notification)

Run the automated registration script in your production environment:

```bash
node scripts/register-pesapal-ipn.ts
```

The script will:
1. Connect to Pesapal Live API 3.0 (`https://pay.pesapal.com/v3/api/Auth/RequestToken`).
2. Query existing registered IPNs (`GetIPNList`) to prevent duplicates.
3. Register `https://jundesigns.rw/api/pesapal/ipn` with notification type `GET`.
4. Output the returned UUID `IPN_ID`.

Copy this UUID and set it in your environment:
```bash
PESAPAL_IPN_ID=<returned-ipn-uuid>
```
Redeploy or restart the Next.js production server.

---

## 4. Webhook & Endpoint Verification

Confirm that your public endpoints respond properly:

| Endpoint | Method | Purpose | Expected Status |
| :--- | :--- | :--- | :--- |
| `https://jundesigns.rw/api/pesapal/ipn` | `GET` / `POST` | IPN webhook notification | `200 OK` with `{ status: 200, orderNotificationType: "IPNCHANGE" }` |
| `https://jundesigns.rw/booking/return` | `GET` | Pesapal browser redirect callback | `307 Redirect` to `/booking/[ref]?confirmed=1` |
| `https://jundesigns.rw/booking/cancelled` | `GET` | User cancels on Pesapal portal | `200 OK` (User-friendly cancellation view) |
| `https://jundesigns.rw/api/booking/[ref]/status` | `GET` | Drawer polling endpoint | `200 OK` with JSON status |

---

## 5. Automated Reconciliation Cron Setup

Set up scheduled background cron triggers (via Vercel Cron, GitHub Actions, or Linux crontab) to protect against dropped webhooks and auto-release expired holds:

### 1-Minute Reconcile Holds
- **URL**: `https://jundesigns.rw/api/cron/reconcile-holds`
- **Schedule**: `* * * * *` (Every 1 minute)
- **Header**: `Authorization: Bearer <CRON_SECRET>`
- **Action**: Cancels expired holds older than 10 minutes and notifies Pesapal.

### 10-Minute Pending Status Reconciliation
- **URL**: `https://jundesigns.rw/api/cron/reconcile-pending`
- **Schedule**: `*/10 * * * *` (Every 10 minutes)
- **Header**: `Authorization: Bearer <CRON_SECRET>`
- **Action**: Queries Pesapal for any orders still in `payment_pending` status to catch any network interruptions during IPN delivery.

---

## 6. End-to-End Live Verification Test

1. Navigate to `https://jundesigns.rw/workshops`.
2. Open the booking drawer for **Imigongo Painting**.
3. Choose a future date and slot, select 1 guest.
4. Fill in customer details and proceed to **Step 3 (Payment)**.
5. Verify:
   - 10-minute hold countdown timer begins.
   - Pesapal live checkout portal loads inside the responsive frame.
   - Fallback button `"Having trouble with the embedded frame? Open in a new tab"` opens `pay.pesapal.com` in a separate tab.
6. Complete payment via live card or MTN MoMo.
7. Verify:
   - Drawer immediately auto-detects status change and transitions to **Step 4 Confirmation**.
   - Confirmation page shows booking reference `JUN-XXXXXXXX` with `.ics` calendar download.
   - Guest receives confirmation email with PDF/ICS attachment.
   - Studio receives notification email.
8. Test refund workflow:
   - Log into `/admin`.
   - Open the test booking.
   - Submit a refund request with remarks.
   - Verify the request appears under **Refund Requests** in the Pesapal Merchant Portal for final disbursement.

---

## 7. Troubleshooting & Emergency Contacts

- **Pesapal Technical Support**: `support@pesapal.com` / `developer@pesapal.com`
- **Jun Designs Studio Phone**: `+250 780 324 944`
- **Studio Address**: Kigali Culture Village, Agaseke Center building, Rebero, Kicukiro, Street KK 557 St, Kigali, Rwanda
