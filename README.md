# Jun Designs - Web Platform and Workshop Booking Engine

Web platform and cultural workshop booking system for Jun Designs LTD (Kigali, Rwanda). Built with Next.js, TypeScript, Tailwind CSS, and Pesapal API 3.0 payments.

## Requirements

- Node.js 20.x or higher (tested on Node 22/24)
- npm 10.x or higher
- Git 2.40 or higher

## Setup Steps

1. Install project dependencies:
   ```bash
   npm install
   ```

2. Copy the environment variables template and configure your values:
   ```bash
   cp .env.example .env.local
   ```

3. Fill in the required variables in `.env.local`:
   - `PESAPAL_ENV`: `sandbox` (for testing) or `live` (for production)
   - `PESAPAL_CONSUMER_KEY`: Pesapal API 3.0 consumer key
   - `PESAPAL_CONSUMER_SECRET`: Pesapal API 3.0 consumer secret
   - `PESAPAL_IPN_ID`: IPN registration GUID (obtained via registration script below)
   - `APP_URL`: Canonical public base URL (e.g. `http://localhost:3000` or tunnel URL)
   - `ADMIN_PASSWORD`: Password for studio operational dashboard (`/admin`)
   - `CRON_SECRET`: Bearer token for scheduled reconciliation jobs

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
.
├── src/
│   ├── app/                               # Next.js App Router pages and route handlers
│   │   ├── api/                           # Backend API routes (booking, pesapal, admin, cron)
│   │   │   ├── admin/                     # Administrative actions (auth, cancel, refund)
│   │   │   ├── booking/                   # Booking lifecycle (hold, status, webhook)
│   │   │   ├── cron/                      # Automated reconciliations (holds, pending)
│   │   │   └── pesapal/ipn/               # Pesapal IPN webhook receiver
│   │   ├── admin/                         # Minimal studio administration dashboard
│   │   ├── booking/                       # Booking pages (confirmation, return, cancelled)
│   │   └── workshops/                     # Workshop dynamic routing and catalog
│   ├── components/                        # UI Component Library
│   │   ├── atoms/                         # Buttons, form fields, typography elements
│   │   ├── molecules/                     # Accordions, fact strips, sticky booking bar
│   │   └── organisms/                     # Header, footer, booking drawer components
│   ├── content/                           # Static data files (workshops catalog, FAQs)
│   └── lib/                               # Core business logic
│       └── booking/                       # Booking state store, mutex lock, email dispatch
│           └── pesapal/                   # Pesapal API 3.0 client, types, and provider adapter
├── public/                                # Static public assets and optimized images
├── scripts/                               # CLI utilities and maintenance scripts
│   ├── register-pesapal-ipn.ts            # One-off Pesapal IPN registration utility
│   ├── scan-working-tree-secrets.mjs      # Local secret auditor
│   └── capture-pesapal-ui.mjs             # Headless browser verification script
├── docs/                                  # Production documentation and settings
│   ├── pesapal-go-live.md                 # Go-live checklist for Pesapal production
│   └── github-settings.md                 # GitHub repository protection settings
├── test-pesapal.mjs                       # Integration and concurrency test suite
└── test-pesapal-security.mjs              # Security and authorization test suite
```

## Running Tests

- Run the full Pesapal integration and concurrency test suite:
  ```bash
  node test-pesapal.mjs
  ```

- Run the security, tamper-rejection, and admin refund tests:
  ```bash
  node test-pesapal-security.mjs
  ```

- Run static code checks and type validation:
  ```bash
  npm run lint
  npx tsc --noEmit
  ```

- Run local secret scanner:
  ```bash
  npm run secretlint
  ```

- Build production bundle:
  ```bash
  npm run build
  ```

## Pesapal Sandbox Testing with Local Tunnel

To test end-to-end payment callbacks and IPN webhooks against the Pesapal Sandbox from a local development environment:

1. Expose your local server using a tunnel tool:
   - Using Cloudflare Tunnel:
     ```bash
     cloudflared tunnel --url http://localhost:3000
     ```
   - Or using ngrok:
     ```bash
     ngrok http 3000
     ```

2. Update `APP_URL` in `.env.local` to match your active HTTPS tunnel address:
   ```bash
   APP_URL=https://your-tunnel-subdomain.trycloudflare.com
   ```

3. Register your tunnel IPN endpoint with Pesapal API 3.0:
   ```bash
   node scripts/register-pesapal-ipn.ts
   ```
   The script registers `https://your-tunnel-subdomain.trycloudflare.com/api/pesapal/ipn` and updates `PESAPAL_IPN_ID` in `.env.local`.

4. Start your local server (`npm run dev` or `npm run start`) and complete a test checkout.

## Production Deployment

For the complete production transition checklist, credentials setup, and gateway verification, consult [docs/pesapal-go-live.md](docs/pesapal-go-live.md).
