export type BookingStatus =
  | "held"
  | "payment_pending"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded";

export type TimeSlot = "10:00" | "16:00";

export interface Booking {
  id: string;
  reference: string;
  workshopSlug: string;
  workshopName: string;
  date: string; // YYYY-MM-DD
  slot: TimeSlot;
  guests: number;
  amountRwf: number;
  amountUsdEstimate: number;
  currency: "RWF";
  status: BookingStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCountry: string;
  note?: string;
  holdExpiresAt: string; // ISO date string
  paymentReference?: string;
  paymentProvider?: "pesapal" | "card" | "momo" | "airtel";
  pesapalOrderTrackingId?: string;
  pesapalConfirmationCode?: string;
  pesapalPaymentMethod?: string;
  pesapalPaymentAccount?: string;
  redirectUrl?: string;
  paidAt?: string;
  refundStatus?: "none" | "requested" | "refunded";
  refundRemarks?: string;
  refundRequestedAt?: string;
  idempotencyKey?: string;
  confirmationEmailSentAt?: string;
  studioEmailSentAt?: string;
  reminderEmailSentAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SlotAvailability {
  slot: TimeSlot;
  timeLabel: string;
  totalCapacity: number;
  bookedCount: number;
  heldCount: number;
  remainingPlaces: number;
  isAvailable: boolean;
  disabledReason?: string;
}

export interface DayAvailability {
  date: string; // YYYY-MM-DD
  slots: SlotAvailability[];
  hasSpace: boolean;
  isPast: boolean;
  isBlocked: boolean;
  isBeyondWindow: boolean;
}

export interface AvailabilityConfig {
  capacityPerSlot: number;
  cutoffHoursBeforeSlot: number;
  maxGuestsPerBooking: number;
  maxDaysInAdvance: number;
  blockedDates: string[];
  usdRate: number; // e.g. 1 USD = 1350 RWF
  eurRate: number; // e.g. 1 EUR = 1470 RWF
  cancellationPolicyText: string;
}

export interface CreateHoldParams {
  workshopSlug: string;
  date: string;
  slot: TimeSlot;
  guests: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCountry: string;
  note?: string;
  idempotencyKey?: string;
}

export interface PaymentRequest {
  bookingReference: string;
  provider: "card" | "momo" | "airtel";
  simulatedScenario?: "success" | "card_declined" | "expired_hold" | "network_error";
  idempotencyKey: string;
}

export interface PaymentResult {
  success: boolean;
  booking?: Booking;
  paymentReference?: string;
  error?: string;
  errorCode?: "DECLINED" | "EXPIRED_HOLD" | "NETWORK_ERROR" | "NOT_FOUND" | "ALREADY_PAID";
}
