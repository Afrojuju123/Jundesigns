INSERT OR REPLACE INTO admin_config (id, capacity_per_slot, blocked_dates, cancellation_policy_text, updated_at) VALUES (1, 10, '[]', 'Free cancellation and full reschedule up to 48 hours before your session starts. Cancellations within 48 hours are non-refundable, but we will happily reschedule to another available slot whenever possible. To cancel or change dates, call or WhatsApp +250 780 324 944.', CURRENT_TIMESTAMP);

INSERT OR REPLACE INTO bookings (
  id, reference, workshop_slug, date, slot, guests, status,
  customer_name, customer_email, customer_phone, special_requests,
  amount_paid, currency, pesapal_order_tracking_id, pesapal_merchant_reference,
  payment_method, hold_expires_at, created_at, updated_at, reminder_sent_at,
  cancelled_at, refund_amount, refund_reason
) VALUES (
  'bk-sample-1',
  'JUN-2026-M8K2',
  'imigongo-painting',
  '2026-11-05',
  '10:00',
  2,
  'paid',
  'Elena Rostova',
  'elena.r@example.com',
  '+250 788 123 456',
  'Two adults. First time in Kigali, very excited for traditional art!',
  50000,
  'RWF',
  NULL,
  'PAY-RW-982141',
  'card',
  '2026-11-05T18:14:24.039Z',
  '2026-11-04T16:14:24.039Z',
  '2026-11-04T17:14:24.039Z',
  '2026-11-04T18:19:14.829Z',
  NULL,
  NULL,
  NULL
);

INSERT OR REPLACE INTO bookings (
  id, reference, workshop_slug, date, slot, guests, status,
  customer_name, customer_email, customer_phone, special_requests,
  amount_paid, currency, pesapal_order_tracking_id, pesapal_merchant_reference,
  payment_method, hold_expires_at, created_at, updated_at, reminder_sent_at,
  cancelled_at, refund_amount, refund_reason
) VALUES (
  'bk-sample-2',
  'JUN-2026-W3F7',
  'hand-weaving',
  '2026-11-05',
  '16:00',
  3,
  'paid',
  'David Campbell',
  'd.campbell@example.org',
  '+1 415 889 0122',
  'Traveling with family. Daughter is an art student.',
  75000,
  'RWF',
  NULL,
  'PAY-MOMO-554109',
  'momo',
  '2026-11-05T18:14:24.039Z',
  '2026-11-04T16:01:04.039Z',
  '2026-11-04T17:07:44.039Z',
  '2026-11-04T18:19:14.829Z',
  NULL,
  NULL,
  NULL
);

INSERT OR REPLACE INTO bookings (
  id, reference, workshop_slug, date, slot, guests, status,
  customer_name, customer_email, customer_phone, special_requests,
  amount_paid, currency, pesapal_order_tracking_id, pesapal_merchant_reference,
  payment_method, hold_expires_at, created_at, updated_at, reminder_sent_at,
  cancelled_at, refund_amount, refund_reason
) VALUES (
  'bk-sample-3',
  'JUN-2026-D9N4',
  'traditional-dance',
  '2026-11-06',
  '10:00',
  4,
  'paid',
  'Sarah & Marc Jenkins',
  'jenkins.family@example.co.uk',
  '+44 7700 900888',
  'Two adults, two teenagers (14 and 16). Excited to dance!',
  100000,
  'RWF',
  NULL,
  'PAY-AIRTEL-129034',
  'airtel',
  '2026-11-06T18:14:24.039Z',
  '2026-11-04T15:20:11.039Z',
  '2026-11-04T17:01:22.039Z',
  '2026-11-04T18:19:14.829Z',
  NULL,
  NULL,
  NULL
);

INSERT OR REPLACE INTO bookings (
  id, reference, workshop_slug, date, slot, guests, status,
  customer_name, customer_email, customer_phone, special_requests,
  amount_paid, currency, pesapal_order_tracking_id, pesapal_merchant_reference,
  payment_method, hold_expires_at, created_at, updated_at, reminder_sent_at,
  cancelled_at, refund_amount, refund_reason
) VALUES (
  'bk-sample-4',
  'JUN-2026-G1H5',
  'igisoro-game',
  '2026-11-06',
  '16:00',
  2,
  'paid',
  'Kagabo Jean-Pierre',
  'jp.kagabo@example.rw',
  '+250 783 456 789',
  'Bringing a friend from abroad to learn Igisoro.',
  50000,
  'RWF',
  NULL,
  'PAY-MOMO-771239',
  'momo',
  '2026-11-06T18:14:24.039Z',
  '2026-11-04T14:45:00.039Z',
  '2026-11-04T16:50:00.039Z',
  NULL,
  NULL,
  NULL,
  NULL
);
