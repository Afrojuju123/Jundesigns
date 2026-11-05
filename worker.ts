/**
 * Cloudflare Worker Entrypoint with Scheduled Cron Handlers
 * Wraps OpenNext's generated Next.js handler while adding native Cloudflare cron triggers.
 */

// @ts-ignore
import openNextHandler from "./.open-next/worker.js";
import {
  purgeExpiredHolds,
  processDueReminders,
  getAllBookings,
  applyPesapalStatusTransition,
} from "./src/lib/booking/store";

interface ScheduledController {
  scheduledTime: number;
  cron: string;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

export default {
  ...openNextHandler,

  /**
   * Cloudflare Cron Trigger Handler
   * Triggers configured in wrangler.jsonc:
   * 1. Every 10 mins ("*\/10 * * * *"): purge expired holds
   * 2. Every 15 mins ("*\/15 * * * *"): reconcile pending Pesapal payments
   * 3. Daily at 06:00 UTC ("0 6 * * *", 08:00 Kigali): send 24h session reminders
   */
  async scheduled(controller: ScheduledController, env: CloudflareEnv, ctx: ExecutionContext) {
    const cron = controller.cron;
    const nowIso = new Date(controller.scheduledTime).toISOString();
    console.log(`[CRON] Scheduled event fired for pattern: '${cron}' at ${nowIso}`);

    if (cron === "*/10 * * * *") {
      ctx.waitUntil(
        (async () => {
          const purged = await purgeExpiredHolds();
          console.log(`[CRON] Purged ${purged} expired holds.`);
        })()
      );
    } else if (cron === "*/15 * * * *") {
      ctx.waitUntil(
        (async () => {
          const all = await getAllBookings();
          const pending = all.filter(
            (b) =>
              (b.status === "payment_pending" || b.status === "held") &&
              Boolean(b.pesapalOrderTrackingId)
          );
          let updated = 0;
          for (const b of pending) {
            try {
              const res = await applyPesapalStatusTransition(b.pesapalOrderTrackingId!, {
                merchantReference: b.reference,
              });
              if (res.success && res.transition !== "unchanged") {
                updated++;
              }
            } catch (err: any) {
              console.warn(`[CRON] Error reconciling ${b.reference}:`, err?.message);
            }
          }
          console.log(`[CRON] Reconciled pending payments: scanned ${pending.length}, updated ${updated}.`);
        })()
      );
    } else if (cron === "0 6 * * *") {
      ctx.waitUntil(
        (async () => {
          const res = await processDueReminders();
          console.log(`[CRON] Sent ${res.sent} session reminders (scanned ${res.scanned}).`);
        })()
      );
    }
  },
};
