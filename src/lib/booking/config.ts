import { AvailabilityConfig } from "./types";

export const bookingConfig: AvailabilityConfig = {
  capacityPerSlot: 10,
  cutoffHoursBeforeSlot: 2, // e.g. 8:00am cut-off for 10:00am, 2:00pm for 4:00pm
  maxGuestsPerBooking: 8,
  maxDaysInAdvance: 90,
  blockedDates: [], // e.g. specific holidays
  usdRate: 1350,
  eurRate: 1470,
  cancellationPolicyText:
    "Free cancellation and full reschedule up to 48 hours before your session starts. Cancellations within 48 hours are non-refundable, but we will happily reschedule to another available slot whenever possible. To cancel or change dates, call or WhatsApp +250 780 324 944.",
};

export const TIME_SLOTS: { slot: "10:00" | "16:00"; label: string; hour: number }[] = [
  { slot: "10:00", label: "10:00am (Morning)", hour: 10 },
  { slot: "16:00", label: "4:00pm (Afternoon)", hour: 16 },
];

export const COUNTRY_CODES = [
  { code: "+250", country: "Rwanda", flag: "🇷🇼", name: "Rwanda (+250)" },
  { code: "+1", country: "United States / Canada", flag: "🇺🇸", name: "USA / Canada (+1)" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧", name: "UK (+44)" },
  { code: "+33", country: "France", flag: "🇫🇷", name: "France (+33)" },
  { code: "+49", country: "Germany", flag: "🇩🇪", name: "Germany (+49)" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱", name: "Netherlands (+31)" },
  { code: "+32", country: "Belgium", flag: "🇧🇪", name: "Belgium (+32)" },
  { code: "+254", country: "Kenya", flag: "🇰🇪", name: "Kenya (+254)" },
  { code: "+256", country: "Uganda", flag: "🇺🇬", name: "Uganda (+256)" },
  { code: "+255", country: "Tanzania", flag: "🇹🇿", name: "Tanzania (+255)" },
  { code: "+27", country: "South Africa", flag: "🇿🇦", name: "South Africa (+27)" },
  { code: "+61", country: "Australia", flag: "🇦🇺", name: "Australia (+61)" },
];

export function calculateEstimates(rwfAmount: number) {
  const usd = Math.round((rwfAmount / bookingConfig.usdRate) * 100) / 100;
  const eur = Math.round((rwfAmount / bookingConfig.eurRate) * 100) / 100;
  return { usd, eur };
}
