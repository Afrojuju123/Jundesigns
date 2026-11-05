# Cloudflare Go-Live & Production Verification Checklist — Jun Designs

This document outlines the final checklist and verification steps to deploy Jun Designs live on Cloudflare Workers with Cloudflare D1 storage, Pesapal API 3.0 payments, and automated cron jobs.

---

## 1. Secrets & Environment Variables

Go to **Cloudflare Dashboard** &rarr; **Workers & Pages** &rarr; **jundesigns** &rarr; **Settings** &rarr; **Variables and Secrets**.

### Plain Text Variables (Environment Variables)
| Variable | Production Value | Purpose |
| :--- | :--- | :--- |
| `BOOKINGS_ENABLED` | `true` | Enables the full online booking drawer and checkout flow. |
| `APP_URL` | `https://jundesigns.rw` | Public production base URL (used for Pesapal callback & return URLs). |
| `NEXT_PUBLIC_APP_URL` | `https://jundesigns.rw` | Public base URL for client components. |
| `NODE_ENV` | `production` | Production environment flag. |

### Encrypted Secrets (Click "Add Secret")
| Secret | Recommended Value / Source | Purpose |
| :--- | :--- | :--- |
| `ADMIN_PASSWORD` | Strong random password (16+ chars) | Required to log in to `/admin` studio management dashboard. |
| `SESSION_SECRET` | 32-character random string | Signs the admin session cookie (`jun_admin_session`). |
| `CRON_SECRET` | 32-character random string | Authenticates scheduled and manual `/api/cron/*` invocations. |
| `RESEND_API_KEY` | `re_...` from [Resend.com](https://resend.com) | Dispatches transactional booking confirmation and alert emails. |
| `PESAPAL_ENV` | `sandbox` *(first)* &rarr; `live` *(after test)* | Controls Pesapal API endpoint environment. |
| `PESAPAL_CONSUMER_KEY` | From Pesapal Merchant Dashboard | API 3.0 Consumer Key. |
| `PESAPAL_CONSUMER_SECRET` | From Pesapal Merchant Dashboard | API 3.0 Consumer Secret. |
| `PESAPAL_IPN_ID` | UUID registered in Pesapal IPN portal | Webhook notification ID pointing to `https://jundesigns.rw/api/pesapal/ipn`. |

---

## 2. Cloudflare D1 Database Verification

1. Navigate to **Storage & Databases** &rarr; **D1 SQL Database** &rarr; **`jundesigns-db`**.
2. Run this query in the **Console** tab:
   ```sql
   SELECT count(*) as total_bookings, count(case when status='paid' then 1 end) as paid_bookings FROM bookings;
   ```
3. Verify that table records exist and that `admin_config` has row `id = 1`:
   ```sql
   SELECT * FROM admin_config WHERE id = 1;
   ```

---

## 3. Custom Domain & DNS Configuration

1. In the **jundesigns** Worker dashboard, navigate to **Settings** &rarr; **Triggers**.
2. Under **Custom Domains**, click **Add Custom Domain**:
   - Add `jundesigns.rw`
   - Add `www.jundesigns.rw` (if applicable)
3. Cloudflare will automatically provision SSL certificates and routing.
4. Under **SSL/TLS** &rarr; set encryption mode to **Full (Strict)**.

---

## 4. Automated Scheduled Jobs (Crons)

Cron triggers are defined in [`wrangler.jsonc`](file:///c:/Users/Nelson/Downloads/Jun%20Designs/wrangler.jsonc) and handled natively by `worker.ts`:

| Pattern | Frequency | Action |
| :--- | :--- | :--- |
| `*/10 * * * *` | Every 10 minutes | **Purge Expired Holds**: Releases held slots whose 10-minute hold window lapsed. |
| `*/15 * * * *` | Every 15 minutes | **Reconcile Pending Payments**: Polls Pesapal API 3.0 for any stuck orders. |
| `0 6 * * *` | Daily at 06:00 UTC (08:00 Kigali) | **Session Reminders**: Sends reminder emails to guests scheduled for the next 24 hours. |

---

## 5. End-to-End Sandbox Testing Run

Before switching to live Pesapal credentials:

1. **Visit Booking Drawer**:
   - Open `https://jundesigns.rw/workshops/imigongo-painting`
   - Click **Book a workshop**
   - Select tomorrow's date & `10:00am` slot & 2 guests.
   - Enter your name, email, and phone number.
   - Click **Continue to Payment**.
2. **Verify Hold**:
   - Check that the hold was recorded in D1 with status `held` or `payment_pending`.
3. **Complete Pesapal Sandbox Payment**:
   - On the Pesapal checkout redirect, select sandbox Card or Mobile Money test simulator.
   - Complete payment and confirm redirect to `/booking/return` &rarr; `/booking/[reference]?confirmed=1`.
4. **Verify Confirmation**:
   - Confirmation screen displays the booking reference, guest count, amount paid in RWF, and directions map link.
   - Check your email for the transactional confirmation email and calendar invite (`.ics`).
5. **Verify Admin Dashboard**:
   - Navigate to `https://jundesigns.rw/admin`
   - Log in with your `ADMIN_PASSWORD`.
   - Confirm the new booking appears under upcoming sessions.

---

## 6. Going Live (Production Switch)

1. In **Pesapal Live Merchant Dashboard**:
   - Register the live IPN URL: `https://jundesigns.rw/api/pesapal/ipn`
   - Copy the Live **Consumer Key**, **Consumer Secret**, and **IPN ID**.
2. In Cloudflare Worker **Settings &rarr; Variables and Secrets**:
   - Update `PESAPAL_ENV` to `live`
   - Update `PESAPAL_CONSUMER_KEY` to live key
   - Update `PESAPAL_CONSUMER_SECRET` to live secret
   - Update `PESAPAL_IPN_ID` to live IPN ID
3. Place one real booking with a small amount using a live debit card / Mobile Money to verify live bank settlement.
4. Issue a refund from the `/admin` portal to test full-cycle reconciliation.
