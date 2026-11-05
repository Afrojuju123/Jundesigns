-- Cloudflare D1 Initial Schema Migration: Jun Designs
-- Migration: 0001_initial_schema.sql

-- 1. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  reference TEXT UNIQUE NOT NULL,
  workshop_slug TEXT NOT NULL,
  date TEXT NOT NULL,                         -- YYYY-MM-DD
  slot TEXT NOT NULL,                         -- '10:00' | '16:00'
  guests INTEGER NOT NULL,
  status TEXT NOT NULL,                       -- 'held' | 'paid' | 'cancelled' | 'refunded'
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  special_requests TEXT,
  amount_paid INTEGER NOT NULL,               -- RWF integer
  currency TEXT NOT NULL DEFAULT 'RWF',
  pesapal_order_tracking_id TEXT,
  pesapal_merchant_reference TEXT,
  payment_method TEXT,
  hold_expires_at TEXT,                       -- ISO8601 string
  created_at TEXT NOT NULL,                   -- ISO8601 string
  updated_at TEXT NOT NULL,                   -- ISO8601 string
  reminder_sent_at TEXT,
  cancelled_at TEXT,
  refund_amount INTEGER,
  refund_reason TEXT
);

-- Indices for fast availability checking, hold purging, and lookup
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(reference);
CREATE INDEX IF NOT EXISTS idx_bookings_availability ON bookings(workshop_slug, date, slot, status);
CREATE INDEX IF NOT EXISTS idx_bookings_hold_expiry ON bookings(status, hold_expires_at);
CREATE INDEX IF NOT EXISTS idx_bookings_pesapal_tracking ON bookings(pesapal_order_tracking_id);

-- 2. Admin Configuration Table (single row with id=1)
CREATE TABLE IF NOT EXISTS admin_config (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  capacity_per_slot INTEGER NOT NULL DEFAULT 8,
  blocked_dates TEXT NOT NULL DEFAULT '[]',   -- JSON array string: ["2026-12-25", ...]
  cancellation_policy_text TEXT NOT NULL DEFAULT 'Free cancellation up to 48 hours before the session for a full refund.',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed default configuration if empty
INSERT OR IGNORE INTO admin_config (id, capacity_per_slot, blocked_dates, cancellation_policy_text, updated_at)
VALUES (
  1,
  8,
  '[]',
  'Free cancellation up to 48 hours before the session for a full refund. Cancellations within 48 hours are non-refundable but can be rescheduled once with at least 12 hours notice.',
  CURRENT_TIMESTAMP
);

-- 3. Idempotency Keys Table (for payment webhooks & status transitions)
CREATE TABLE IF NOT EXISTS idempotency_keys (
  key TEXT PRIMARY KEY,
  response TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_idempotency_created_at ON idempotency_keys(created_at);

-- 4. Audit Log Table (for email dispatches, status transitions, admin overrides)
CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  event TEXT NOT NULL,
  details TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_log_event ON audit_log(event);
