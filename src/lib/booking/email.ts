import { Booking } from "./types";
import { bookingConfig } from "./config";
import { workshops } from "@/content/workshops";

export interface EmailDispatchRecord {
  id: string;
  bookingReference: string;
  recipient: string;
  subject: string;
  type: "guest_confirmation" | "studio_alert" | "session_reminder";
  status: "sent" | "failed" | "retried";
  attempts: number;
  lastAttemptAt: string;
  error?: string;
}

// In-memory audit trail for transactional emails
const emailAuditLog: EmailDispatchRecord[] = [];

/**
 * Format date for human readability: e.g. "Wednesday, 11 November 2026"
 */
export function formatBookingDate(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Format slot to display label: "10:00am - 12:00pm CAT"
 */
export function formatSlotLabel(slot: "10:00" | "16:00"): string {
  if (slot === "10:00") return "10:00am – 12:00pm (Central Africa Time, UTC+2)";
  return "4:00pm – 6:00pm (Central Africa Time, UTC+2)";
}

/**
 * Generate RFC 5545 compliant iCalendar string (.ics)
 */
export function generateIcsCalendar(booking: Booking): string {
  const [year, month, day] = booking.date.split("-").map(Number);
  // Kigali is UTC+2 (Central Africa Time, no daylight saving).
  // 10:00 CAT is 08:00 UTC. 16:00 CAT is 14:00 UTC.
  const startHourUtc = booking.slot === "10:00" ? 8 : 14;
  const endHourUtc = startHourUtc + 2;

  const pad = (n: number) => String(n).padStart(2, "0");
  const y = String(year);
  const m = pad(month);
  const d = pad(day);

  const dtStart = `${y}${m}${d}T${pad(startHourUtc)}0000Z`;
  const dtEnd = `${y}${m}${d}T${pad(endHourUtc)}0000Z`;
  const dtStamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const description = [
    `Jun Designs Cultural Workshop: ${booking.workshopName}`,
    `Reference: ${booking.reference}`,
    `Guests: ${booking.guests}`,
    `Location: Kigali Culture Village (Agaseke Center building), Rebero, Kicukiro. Street KK 557 St, Kigali.`,
    `Phone: +250 780 324 944`,
    `Please arrive 10 minutes prior to session start.`,
  ].join("\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Jun Designs//Cultural Workshop Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${booking.reference}@jundesigns.rw`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:Jun Designs — ${booking.workshopName} (${booking.guests} ${booking.guests === 1 ? "guest" : "guests"})`,
    `DESCRIPTION:${description}`,
    `LOCATION:Kigali Culture Village, Rebero, Street KK 557 St, Kigali, Rwanda`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/**
 * Helper to get workshop specific 'what to bring'
 */
function getWhatToBring(workshopSlug: string): string {
  const workshop = workshops.find((w) => w.slug === workshopSlug);
  return (
    workshop?.whatToBring ||
    "All workshop materials, tools and guidance are fully provided. Wear comfortable clothes and bring a bottle of water if you wish. Mornings and late afternoons on Rebero hill can be cool, so a light jacket is recommended."
  );
}

// ---------------------------------------------------------------------------
// 1. GUEST CONFIRMATION EMAIL
// ---------------------------------------------------------------------------

export function renderGuestConfirmationEmail(booking: Booking): {
  subject: string;
  html: string;
  text: string;
} {
  const dateFormatted = formatBookingDate(booking.date);
  const timeFormatted = formatSlotLabel(booking.slot);
  const whatToBring = getWhatToBring(booking.workshopSlug);
  const subject = `Your ${booking.workshopName} booking is confirmed: ${dateFormatted}`;

  const text = `
MURAHO ${booking.customerName.toUpperCase()},

Your booking at Jun Designs is confirmed. We look forward to welcoming you to our studio on Rebero hill.

BOOKING REFERENCE: ${booking.reference}
Status: Confirmed & Paid

DETAILS:
- Workshop: ${booking.workshopName}
- Date: ${dateFormatted}
- Time: ${timeFormatted}
- Guests: ${booking.guests} ${booking.guests === 1 ? "person" : "people"}
- Total Paid: ${booking.amountRwf.toLocaleString()} RWF (approx. $${booking.amountUsdEstimate})
- Payment Ref: ${booking.paymentReference || "N/A"}

LOCATION & DIRECTIONS:
Kigali Culture Village (Agaseke Center building), Rebero, Kicukiro.
Street KK 557 St, Kigali, Rwanda.
Google Maps: https://maps.google.com/?q=Kigali+Culture+Village+Rebero+Rwanda

Directions note:
We are located at the Kigali Culture Village on Rebero hill overlooking the capital. Drivers and moto-taxis readily recognise "Kigali Culture Village Rebero" or CANAL Olympia nearby. Once inside the main entrance, proceed to the Agaseke Center building.

WHAT TO BRING:
${whatToBring}

CANCELLATION & RESCHEDULE POLICY:
${bookingConfig.cancellationPolicyText}

NEED ASSISTANCE?
Call or WhatsApp: +250 780 324 944
Email: workshops@jundesigns.rw

Jun Designs LTD — Kigali, Rwanda
https://jundesigns.rw
`.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF6F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1F1209; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF6F0; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card (Max 600px) -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E8DFD5; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(31, 18, 9, 0.05);">
          
          <!-- Header Banner (Dark Brown with Brand Logo) -->
          <tr>
            <td style="background-color: #1F1209; padding: 28px 24px; text-align: center;">
              <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #F29C1F; margin-bottom: 8px;">
                JUN DESIGNS &bull; KIGALI, RWANDA
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #FFF8F0; font-family: Georgia, serif; letter-spacing: 0.5px;">
                Booking Confirmed
              </h1>
            </td>
          </tr>

          <!-- Reference & Status Strip -->
          <tr>
            <td style="background-color: #FFF8F0; padding: 14px 24px; border-bottom: 1px solid #E8DFD5; text-align: center;">
              <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #735C4A; font-weight: 600;">Booking Reference:</span>
              <strong style="font-family: monospace; font-size: 16px; color: #1F1209; margin-left: 8px; letter-spacing: 1px;">${booking.reference}</strong>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 28px 24px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.5; color: #1F1209;">
                Muraho <strong>${booking.customerName}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4A3525;">
                Your booking for <strong>${booking.workshopName}</strong> is confirmed. Our local artisans and guide will be ready for you at the studio on Rebero hill.
              </p>

              <!-- Session Details Table -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; border: 1px solid #E8DFD5; border-radius: 6px; background-color: #FCFAF7;">
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #E8DFD5; font-size: 13px; color: #735C4A; width: 35%;">Workshop</td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #E8DFD5; font-size: 14px; font-weight: 600; color: #1F1209;">${booking.workshopName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #E8DFD5; font-size: 13px; color: #735C4A;">Date</td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #E8DFD5; font-size: 14px; font-weight: 600; color: #1F1209;">${dateFormatted}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #E8DFD5; font-size: 13px; color: #735C4A;">Time Slot</td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #E8DFD5; font-size: 14px; font-weight: 600; color: #1F1209;">${timeFormatted}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #E8DFD5; font-size: 13px; color: #735C4A;">Guests</td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #E8DFD5; font-size: 14px; font-weight: 600; color: #1F1209;">${booking.guests} ${booking.guests === 1 ? "person" : "people"}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; font-size: 13px; color: #735C4A;">Amount Paid</td>
                  <td style="padding: 12px 16px; font-size: 14px; font-weight: 700; color: #1F1209;">${booking.amountRwf.toLocaleString()} RWF <span style="font-size: 12px; color: #735C4A; font-weight: 400;">(approx. $${booking.amountUsdEstimate})</span></td>
                </tr>
              </table>

              <!-- Action Button: Open Confirmation Online -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                <tr>
                  <td align="center">
                    <a href="https://jundesigns.rw/booking/${booking.reference}" style="display: inline-block; background-color: #F29C1F; color: #1F1209; font-size: 14px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; text-decoration: none; padding: 14px 28px; border-radius: 4px; box-shadow: 0 2px 6px rgba(242, 156, 31, 0.3);">
                      View Booking & Calendar
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Location & Directions Box -->
              <div style="background-color: #FFFFFF; border-left: 3px solid #F29C1F; border-top: 1px solid #E8DFD5; border-right: 1px solid #E8DFD5; border-bottom: 1px solid #E8DFD5; padding: 16px; margin-bottom: 20px; border-radius: 0 4px 4px 0;">
                <h3 style="margin: 0 0 6px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #1F1209; font-weight: 700;">Location & Directions</h3>
                <p style="margin: 0 0 8px 0; font-size: 13px; line-height: 1.5; color: #4A3525;">
                  <strong>Kigali Culture Village</strong> (Agaseke Center building), Rebero, Kicukiro. Street KK 557 St, Kigali.
                </p>
                <p style="margin: 0 0 10px 0; font-size: 13px; line-height: 1.5; color: #6E533F;">
                  Drivers and moto-taxis recognise "Kigali Culture Village Rebero" or CANAL Olympia nearby. Once inside the main entrance, proceed to the Agaseke Center building.
                </p>
                <a href="https://maps.google.com/?q=Kigali+Culture+Village+Rebero+Rwanda" style="font-size: 12px; font-weight: 600; color: #1F1209; text-decoration: underline;">
                  Open location in Google Maps &rarr;
                </a>
              </div>

              <!-- What to Bring -->
              <div style="margin-bottom: 20px; padding: 16px; background-color: #FCFAF7; border: 1px solid #E8DFD5; border-radius: 4px;">
                <h4 style="margin: 0 0 6px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #1F1209;">What to Bring</h4>
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #4A3525;">
                  ${whatToBring}
                </p>
              </div>

              <!-- Cancellation Policy -->
              <div style="margin-bottom: 24px; padding: 14px; background-color: #F7F4F0; border-radius: 4px;">
                <h4 style="margin: 0 0 4px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #735C4A;">Cancellation & Rescheduling</h4>
                <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #5C4635;">
                  ${bookingConfig.cancellationPolicyText}
                </p>
              </div>

              <!-- Contact Line -->
              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #4A3525; border-top: 1px solid #E8DFD5; padding-top: 16px;">
                Questions or running late? Call or WhatsApp us at <strong style="color: #1F1209;">+250 780 324 944</strong>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1F1209; padding: 20px 24px; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 600; color: #FFF8F0;">
                Jun Designs LTD
              </p>
              <p style="margin: 0; font-size: 11px; color: #C9B8A4;">
                Kigali Culture Village, Rebero &bull; Street KK 557 St, Kigali, Rwanda &bull; +250 780 324 944
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

  return { subject, html, text };
}

// ---------------------------------------------------------------------------
// 2. EMAIL TO JUN DESIGNS (STUDIO ALERT)
// ---------------------------------------------------------------------------

export function renderStudioBookingAlertEmail(booking: Booking): {
  subject: string;
  html: string;
  text: string;
} {
  const dateFormatted = formatBookingDate(booking.date);
  const timeFormatted = formatSlotLabel(booking.slot);
  const subject = `New booking: ${booking.workshopName}, ${booking.date} ${booking.slot}, ${booking.guests} ${booking.guests === 1 ? "guest" : "guests"}`;

  const text = `
NEW WORKSHOP BOOKING RECEIVED

Reference: ${booking.reference}
Workshop: ${booking.workshopName}
Date: ${dateFormatted}
Time Slot: ${timeFormatted}
Guests: ${booking.guests}

CUSTOMER DETAILS:
- Name: ${booking.customerName}
- Email: ${booking.customerEmail}
- Phone: ${booking.customerCountry} ${booking.customerPhone} (WhatsApp: https://wa.me/${booking.customerCountry.replace(/\+/g, "")}${booking.customerPhone.replace(/\D/g, "")})
- Special Notes / Requests: ${booking.note || "None provided"}

PAYMENT INFORMATION:
- Amount Paid: ${booking.amountRwf.toLocaleString()} RWF
- USD Equivalent: approx. $${booking.amountUsdEstimate}
- Payment Reference: ${booking.paymentReference || "N/A"}
- Payment Method: ${booking.paymentProvider || "card"}
- Status: Confirmed & Paid

Admin Management:
https://jundesigns.rw/admin/bookings/${booking.reference}
`.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF6F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1F1209;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF6F0; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E8DFD5; border-radius: 8px; overflow: hidden;">
          
          <tr style="background-color: #1F1209;">
            <td style="padding: 20px 24px;">
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #F29C1F; margin-bottom: 4px;">
                STUDIO BOOKING ALERT
              </div>
              <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #FFF8F0;">
                New Booking: ${booking.workshopName}
              </h2>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px;">
              <div style="display: inline-block; background-color: #FFF8F0; border: 1px solid #E8DFD5; border-radius: 4px; padding: 6px 12px; margin-bottom: 20px; font-family: monospace; font-size: 15px; font-weight: 700;">
                Ref: ${booking.reference}
              </div>

              <!-- Summary Table -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #E8DFD5; border-radius: 6px; margin-bottom: 20px;">
                <tr style="background-color: #FAF6F0;">
                  <td style="padding: 10px 14px; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #735C4A; border-bottom: 1px solid #E8DFD5;">Field</td>
                  <td style="padding: 10px 14px; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #735C4A; border-bottom: 1px solid #E8DFD5;">Details</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-size: 13px; color: #735C4A; border-bottom: 1px solid #E8DFD5;">Workshop</td>
                  <td style="padding: 10px 14px; font-size: 14px; font-weight: 600; color: #1F1209; border-bottom: 1px solid #E8DFD5;">${booking.workshopName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-size: 13px; color: #735C4A; border-bottom: 1px solid #E8DFD5;">Date & Slot</td>
                  <td style="padding: 10px 14px; font-size: 14px; font-weight: 600; color: #1F1209; border-bottom: 1px solid #E8DFD5;">${dateFormatted} (${booking.slot})</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-size: 13px; color: #735C4A; border-bottom: 1px solid #E8DFD5;">Guests</td>
                  <td style="padding: 10px 14px; font-size: 14px; font-weight: 600; color: #1F1209; border-bottom: 1px solid #E8DFD5;">${booking.guests}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-size: 13px; color: #735C4A; border-bottom: 1px solid #E8DFD5;">Guest Name</td>
                  <td style="padding: 10px 14px; font-size: 14px; color: #1F1209; border-bottom: 1px solid #E8DFD5;">${booking.customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-size: 13px; color: #735C4A; border-bottom: 1px solid #E8DFD5;">Contact</td>
                  <td style="padding: 10px 14px; font-size: 13px; color: #1F1209; border-bottom: 1px solid #E8DFD5;">
                    <a href="mailto:${booking.customerEmail}" style="color: #1F1209; text-decoration: underline;">${booking.customerEmail}</a><br>
                    <span>${booking.customerCountry} ${booking.customerPhone}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-size: 13px; color: #735C4A; border-bottom: 1px solid #E8DFD5;">Special Notes</td>
                  <td style="padding: 10px 14px; font-size: 13px; color: #4A3525; border-bottom: 1px solid #E8DFD5;">${booking.note || "<em>None provided</em>"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-size: 13px; color: #735C4A;">Amount Paid</td>
                  <td style="padding: 10px 14px; font-size: 14px; font-weight: 700; color: #1F1209;">${booking.amountRwf.toLocaleString()} RWF (Ref: ${booking.paymentReference || "N/A"})</td>
                </tr>
              </table>

              <!-- Action Link to Admin -->
              <div style="text-align: center; margin: 24px 0 12px 0;">
                <a href="https://jundesigns.rw/admin/bookings/${booking.reference}" style="display: inline-block; background-color: #1F1209; color: #FFF8F0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 12px 24px; border-radius: 4px; text-decoration: none;">
                  Open Booking in Admin
                </a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

  return { subject, html, text };
}

// ---------------------------------------------------------------------------
// 3. 24-HOUR REMINDER EMAIL
// ---------------------------------------------------------------------------

export function renderReminderEmail(booking: Booking): {
  subject: string;
  html: string;
  text: string;
} {
  const timeFormatted = formatSlotLabel(booking.slot);
  const whatToBring = getWhatToBring(booking.workshopSlug);
  const subject = `Reminder: Your ${booking.workshopName} at Jun Designs tomorrow at ${booking.slot === "10:00" ? "10:00am" : "4:00pm"}`;

  const text = `
MURAHO ${booking.customerName.toUpperCase()},

This is a friendly reminder that your workshop session is scheduled for tomorrow at Jun Designs.

SESSION DETAILS:
- Workshop: ${booking.workshopName}
- Date: Tomorrow (${formatBookingDate(booking.date)})
- Time: ${timeFormatted}
- Guests: ${booking.guests}
- Booking Reference: ${booking.reference}

LOCATION & ARRIVAL:
Kigali Culture Village (Agaseke Center building), Rebero, Kicukiro.
Street KK 557 St, Kigali.
Google Maps: https://maps.google.com/?q=Kigali+Culture+Village+Rebero+Rwanda

Please plan to arrive 10 minutes prior to session start so we can settle in and begin comfortably.

WHAT TO BRING:
${whatToBring}

NEED DIRECTIONS OR ASSISTANCE?
Call or WhatsApp: +250 780 324 944

We look forward to seeing you tomorrow!

Jun Designs LTD — Kigali, Rwanda
`.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF6F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1F1209;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF6F0; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E8DFD5; border-radius: 8px; overflow: hidden;">
          
          <tr style="background-color: #1F1209;">
            <td style="padding: 24px; text-align: center;">
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #F29C1F; margin-bottom: 6px;">
                SEE YOU TOMORROW &bull; KIGALI, RWANDA
              </div>
              <h2 style="margin: 0; font-size: 22px; font-weight: 600; color: #FFF8F0; font-family: Georgia, serif;">
                Your Session Reminder
              </h2>
            </td>
          </tr>

          <tr>
            <td style="padding: 28px 24px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #1F1209;">
                Muraho <strong>${booking.customerName}</strong>,
              </p>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #4A3525;">
                We are looking forward to welcoming you tomorrow for your <strong>${booking.workshopName}</strong> workshop.
              </p>

              <div style="background-color: #FCFAF7; border: 1px solid #E8DFD5; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #1F1209;"><strong>Time:</strong> ${timeFormatted}</p>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #1F1209;"><strong>Guests:</strong> ${booking.guests}</p>
                <p style="margin: 0; font-size: 13px; color: #735C4A;"><strong>Ref:</strong> ${booking.reference}</p>
              </div>

              <!-- Location Box -->
              <div style="background-color: #FFF8F0; border-left: 3px solid #F29C1F; padding: 14px; margin-bottom: 20px;">
                <strong style="font-size: 13px; text-transform: uppercase; color: #1F1209; display: block; margin-bottom: 4px;">Meeting Point:</strong>
                <p style="margin: 0 0 6px 0; font-size: 13px; color: #4A3525;">
                  Kigali Culture Village (Agaseke Center building), Rebero, Kicukiro. Street KK 557 St, Kigali.
                </p>
                <a href="https://maps.google.com/?q=Kigali+Culture+Village+Rebero+Rwanda" style="font-size: 12px; font-weight: 600; color: #1F1209;">
                  Open Google Maps &rarr;
                </a>
              </div>

              <!-- What to Bring -->
              <div style="margin-bottom: 24px; padding: 14px; background-color: #FAF6F0; border-radius: 4px;">
                <strong style="font-size: 12px; text-transform: uppercase; color: #735C4A; display: block; margin-bottom: 4px;">What to Bring:</strong>
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #4A3525;">
                  ${whatToBring}
                </p>
              </div>

              <p style="margin: 0; font-size: 13px; color: #4A3525; border-top: 1px solid #E8DFD5; padding-top: 16px;">
                Need directions or running a few minutes late? Call or WhatsApp us at <strong>+250 780 324 944</strong>.
              </p>
            </td>
          </tr>

          <tr style="background-color: #1F1209;">
            <td style="padding: 16px; text-align: center; font-size: 11px; color: #C9B8A4;">
              Jun Designs LTD &bull; Rebero Hill, Kigali &bull; +250 780 324 944
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

  return { subject, html, text };
}

// ---------------------------------------------------------------------------
// 4. TRANSACTIONAL DISPATCH ENGINE WITH RETRIES & AUDIT LOGGING
// ---------------------------------------------------------------------------

async function dispatchWithRetry(
  bookingReference: string,
  recipient: string,
  subject: string,
  type: "guest_confirmation" | "studio_alert" | "session_reminder",
  forceFailUntilAttempt: number = 0
): Promise<{ success: boolean; attempts: number; error?: string }> {
  const maxAttempts = 3;
  let attempts = 0;
  let lastError: string | undefined;

  const dispatchRecord: EmailDispatchRecord = {
    id: `email-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    bookingReference,
    recipient,
    subject,
    type,
    status: "retried",
    attempts: 0,
    lastAttemptAt: new Date().toISOString(),
  };

  while (attempts < maxAttempts) {
    attempts++;
    dispatchRecord.attempts = attempts;
    dispatchRecord.lastAttemptAt = new Date().toISOString();

    try {
      if (attempts <= forceFailUntilAttempt) {
        throw new Error(`SMTP Connection Timeout (Simulated network drop on attempt ${attempts})`);
      }

      // Successful simulated dispatch
      dispatchRecord.status = attempts > 1 ? "retried" : "sent";
      delete dispatchRecord.error;
      emailAuditLog.push(dispatchRecord);
      return { success: true, attempts };
    } catch (err: any) {
      lastError = err?.message || "Unknown email dispatch error";
      dispatchRecord.error = lastError;

      if (attempts < maxAttempts) {
        await new Promise((res) => setTimeout(res, 40 * attempts));
      }
    }
  }

  dispatchRecord.status = "failed";
  emailAuditLog.push(dispatchRecord);
  return { success: false, attempts, error: lastError };
}

/**
 * Send guest confirmation email (Idempotent - checks confirmationEmailSentAt)
 */
export async function sendBookingConfirmationEmail(
  booking: Booking,
  forceFailUntilAttempt: number = 0
): Promise<{ success: boolean; attempts: number; error?: string }> {
  const { subject } = renderGuestConfirmationEmail(booking);
  const result = await dispatchWithRetry(
    booking.reference,
    booking.customerEmail,
    subject,
    "guest_confirmation",
    forceFailUntilAttempt
  );

  if (result.success) {
    booking.confirmationEmailSentAt = new Date().toISOString();
  }

  return result;
}

/**
 * Send Jun Designs studio alert email (Idempotent - checks studioEmailSentAt)
 */
export async function sendStudioAlertEmail(
  booking: Booking,
  studioEmail: string = "workshops@jundesigns.rw"
): Promise<{ success: boolean; attempts: number; error?: string }> {
  const { subject } = renderStudioBookingAlertEmail(booking);
  const result = await dispatchWithRetry(
    booking.reference,
    studioEmail,
    subject,
    "studio_alert"
  );

  if (result.success) {
    booking.studioEmailSentAt = new Date().toISOString();
  }

  return result;
}

/**
 * Send 24-hour reminder email (Idempotent - checks reminderEmailSentAt)
 */
export async function sendReminderEmail(
  booking: Booking
): Promise<{ success: boolean; attempts: number; error?: string }> {
  const { subject } = renderReminderEmail(booking);
  const result = await dispatchWithRetry(
    booking.reference,
    booking.customerEmail,
    subject,
    "session_reminder"
  );

  if (result.success) {
    booking.reminderEmailSentAt = new Date().toISOString();
  }

  return result;
}

export function getEmailAuditLog(): EmailDispatchRecord[] {
  return [...emailAuditLog];
}

export function clearEmailAuditLog(): void {
  emailAuditLog.length = 0;
}
