# Cloudflare Workers Deployment Guide — Jun Designs

This guide documents the Cloudflare Workers deployment configuration for Jun Designs using `@opennextjs/cloudflare`.

---

## 1. Cloudflare Dashboard Settings

In the Cloudflare Dashboard under **Workers & Pages** &rarr; **Overview** &rarr; **jundesigns** (or your connected Git project):

### Build & Deploy Configuration (`Settings > Build`)
| Setting | Value | Notes |
| :--- | :--- | :--- |
| **Framework preset** | `None` / `Custom` | Managed via OpenNext adapter |
| **Build command** | `npx @opennextjs/cloudflare build` | Runs Next.js build + OpenNext bundle generation |
| **Deploy command** | `npx wrangler deploy` | Deploys `.open-next/worker.js` and assets |
| **Root directory** | `/` | Root of repository |
| **Node.js version** | `22.14.0` | Controlled by `.nvmrc` and `engines` in `package.json`. You can also set env var `NODE_VERSION=22.14.0`. |

---

## 2. Environment Variables & Secrets

Configure these under **Settings > Variables and Secrets**:

### Environment Variables (Plain text)
| Variable | Value (Phase A) | Description |
| :--- | :--- | :--- |
| `BOOKINGS_ENABLED` | `false` | **Critical for Phase A**: Disables automated booking/payment routes and displays calm WhatsApp/call fallback. |
| `APP_URL` | `https://jundesigns.rw` | Public production base URL (or `https://jundesigns.<subdomain>.workers.dev`) |
| `NEXT_PUBLIC_APP_URL` | `https://jundesigns.rw` | Public client base URL |
| `NODE_ENV` | `production` | Production mode |

### Encrypted Secrets (Add via "Add Secret" button)
*Required for Phase B & C, or if testing admin/cron/email in production:*
| Secret | Description |
| :--- | :--- |
| `ADMIN_PASSWORD_HASH` | PBKDF2/SHA-256 hash for studio admin portal access |
| `CRON_SECRET` | Bearer token to protect scheduled maintenance endpoints |
| `RESEND_API_KEY` | API key for transactional emails |
| `PESAPAL_CONSUMER_KEY` | Pesapal API 3.0 consumer key |
| `PESAPAL_CONSUMER_SECRET` | Pesapal API 3.0 consumer secret |
| `PESAPAL_IPN_ID` | Pesapal registered IPN ID |

---

## 3. Worker Architecture & Bindings

The project uses `wrangler.jsonc` configured as follows:
- **Worker Name**: `jundesigns`
- **Entrypoint**: `.open-next/worker.js`
- **Compatibility Date**: `2024-12-30`
- **Compatibility Flags**: `["nodejs_compat"]`
- **Static Assets Binding**: `.open-next/assets` (bound to `ASSETS`)

---

## 4. Local Development & Validation Commands

All commands can be executed locally:

```bash
# 1. Type-check all TypeScript files
npm run type-check

# 2. Run secret scan to prevent credential leaks
npm run secretlint

# 3. Build Cloudflare Worker bundle locally
npm run build:worker
# (Equivalent to: npx @opennextjs/cloudflare build)

# 4. Preview locally using Wrangler emulator
npx wrangler dev
# (Equivalent to: npm run preview)

# 5. Run universal header tests
npm run test:header
```

---

## 5. Phase A Fallback Behavior Verification

When `BOOKINGS_ENABLED="false"`:
- **Booking Drawer & Triggers**: Displays a calm notice with a direct WhatsApp link and phone contact:
  > *"Online booking opens soon. To reserve now, message us on WhatsApp or call +250 780 324 944"*
- **API Booking Routes** (`/api/booking/*`): Safely return HTTP 503 with informative JSON message.
- **Admin Portal** (`/admin`): Renders a calm maintenance screen without exposing internal routes.
- **Schools & Groups Quote Flow** (`/schools/request-quote`): Remains functional as an inquiry/email channel with fallbacks.
