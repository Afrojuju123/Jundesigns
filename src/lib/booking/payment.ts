import { Booking, PaymentRequest, PaymentResult } from "./types";
import { confirmBookingPayment, getBookingByReference, applyPesapalStatusTransition } from "./store";
import { pesapalClient } from "./pesapal/client";
import { pesapalProvider } from "./pesapal/provider";

export interface PaymentProvider {
  name: string;
  processPayment(req: PaymentRequest): Promise<PaymentResult>;
  verifyWebhook(payload: any, signature?: string): Promise<{ valid: boolean; reference?: string }>;
}

export class MockPaymentProvider implements PaymentProvider {
  name = "Mock Payment Gateway (Stripe / Flutterwave / MTN MoMo / Airtel Money)";

  async processPayment(req: PaymentRequest): Promise<PaymentResult> {
    const booking = await getBookingByReference(req.bookingReference);
    if (!booking) {
      return {
        success: false,
        error: "Booking not found.",
        errorCode: "NOT_FOUND",
      };
    }

    if (booking.status === "paid") {
      return {
        success: true,
        booking,
        paymentReference: booking.paymentReference,
      };
    }

    if (req.simulatedScenario === "card_declined") {
      return {
        success: false,
        error: "Card declined by issuing bank (insufficient funds or 3D Secure failure). Please try another payment method.",
        errorCode: "DECLINED",
      };
    }

    if (req.simulatedScenario === "network_error") {
      return {
        success: false,
        error: "Network communication timeout with payment processor. Please retry safely.",
        errorCode: "NETWORK_ERROR",
      };
    }

    const forceExpired = req.simulatedScenario === "expired_hold";
    const paymentRef = `PAY-${req.provider.toUpperCase()}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const result = await confirmBookingPayment(
      req.bookingReference,
      paymentRef,
      req.provider,
      { forceExpired }
    );

    if (!result.success) {
      return {
        success: false,
        error: result.error,
        errorCode: (result.errorCode as any) || "EXPIRED_HOLD",
      };
    }

    return {
      success: true,
      booking: result.booking,
      paymentReference: paymentRef,
    };
  }

  async verifyWebhook(
    payload: any,
    signature?: string
  ): Promise<{ valid: boolean; reference?: string }> {
    const isValid = signature === "valid-mock-signature" || signature?.startsWith("sig_");
    if (!isValid) {
      return { valid: false };
    }
    return {
      valid: true,
      reference: payload?.bookingReference || payload?.data?.reference,
    };
  }
}

export class PesapalPaymentProvider implements PaymentProvider {
  name = "Pesapal API 3.0";

  async processPayment(req: PaymentRequest): Promise<PaymentResult> {
    const booking = await getBookingByReference(req.bookingReference);
    if (!booking) {
      return {
        success: false,
        error: "Booking reference not found.",
        errorCode: "NOT_FOUND",
      };
    }

    if (booking.status === "paid") {
      return {
        success: true,
        booking,
        paymentReference: booking.paymentReference,
      };
    }

    if (!booking.pesapalOrderTrackingId) {
      try {
        const order = await pesapalProvider.createPaymentOrder(booking);
        booking.pesapalOrderTrackingId = order.order_tracking_id;
        booking.redirectUrl = order.redirect_url;
      } catch (err: any) {
        return {
          success: false,
          error: err.message || "Failed to initialize Pesapal checkout.",
        };
      }
    }

    // Check status
    const transitionResult = await applyPesapalStatusTransition(
      booking.pesapalOrderTrackingId
    );

    if (transitionResult.booking?.status === "paid") {
      return {
        success: true,
        booking: transitionResult.booking,
        paymentReference: transitionResult.booking.paymentReference,
      };
    }

    return {
      success: false,
      error: transitionResult.error || "Payment is pending authorization.",
    };
  }

  async verifyWebhook(
    payload: any
  ): Promise<{ valid: boolean; reference?: string }> {
    const trackingId = payload?.OrderTrackingId || payload?.orderTrackingId;
    const ref = payload?.OrderMerchantReference || payload?.orderMerchantReference;

    if (!trackingId) {
      return { valid: false };
    }

    const res = await applyPesapalStatusTransition(trackingId, {
      merchantReference: ref,
    });

    return {
      valid: res.success,
      reference: res.booking?.reference,
    };
  }
}

export const mockPaymentProvider = new MockPaymentProvider();
export const pesapalPaymentProvider = new PesapalPaymentProvider();

// Active provider based on configuration
export const paymentProvider: PaymentProvider =
  process.env.PESAPAL_CONSUMER_KEY && process.env.PESAPAL_CONSUMER_KEY !== "mock"
    ? pesapalPaymentProvider
    : mockPaymentProvider;
