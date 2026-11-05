import { Booking } from "../types";
import { pesapalClient } from "./client";
import {
  PesapalBillingAddress,
  PesapalCancelOrderResponse,
  PesapalRefundResponse,
  PesapalSubmitOrderRequest,
  PesapalSubmitOrderResponse,
  PesapalTransactionStatusResponse,
} from "./types";

/**
 * Maps country code strings (e.g. "+250", "RW", "US") to ISO 3166-1 alpha-2 code
 */
export function mapCountryCode(countryStr?: string): string {
  if (!countryStr) return "RW";
  const clean = countryStr.trim().toUpperCase();
  if (clean === "+250" || clean === "RWANDA" || clean === "RW") return "RW";
  if (clean === "+1" || clean === "USA" || clean === "US") return "US";
  if (clean === "+44" || clean === "UK" || clean === "GB") return "GB";
  if (clean === "+33" || clean === "FR") return "FR";
  if (clean === "+49" || clean === "DE") return "DE";
  if (clean === "+254" || clean === "KE") return "KE";
  if (clean === "+256" || clean === "UG") return "UG";
  if (clean === "+255" || clean === "TZ") return "TZ";
  if (clean === "+32" || clean === "BE") return "BE";
  if (clean === "+31" || clean === "NL") return "NL";
  if (clean === "+1" || clean === "CA") return "CA";
  if (/^[A-Z]{2}$/.test(clean)) return clean;
  return "RW";
}

/**
 * Splits customer full name into first and last name
 */
export function splitCustomerName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { firstName: "Guest", lastName: "Guest" };
  }
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: parts[0] };
  }
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ");
  return { firstName, lastName };
}

export class PesapalProvider {
  /**
   * Submit booking order to Pesapal API 3.0
   */
  async createPaymentOrder(booking: Booking): Promise<PesapalSubmitOrderResponse> {
    const appUrl = (process.env.APP_URL || "http://localhost:3000").replace(/\/+$/, "");
    const ipnId = process.env.PESAPAL_IPN_ID || "";

    const { firstName, lastName } = splitCustomerName(booking.customerName);
    const countryCode = mapCountryCode(booking.customerCountry);

    // Clean phone number (Pesapal requires numeric phone)
    const phoneClean = booking.customerPhone.replace(/[^\d+]/g, "");

    const billingAddress: PesapalBillingAddress = {
      email_address: booking.customerEmail,
      phone_number: phoneClean,
      country_code: countryCode,
      first_name: firstName,
      last_name: lastName,
    };

    const description = `Jun Designs - ${booking.workshopName} (${booking.guests} guest${
      booking.guests > 1 ? "s" : ""
    })`.slice(0, 100);

    const submitReq: PesapalSubmitOrderRequest = {
      id: booking.reference,
      currency: "RWF",
      amount: booking.amountRwf,
      description,
      callback_url: `${appUrl}/booking/return`,
      cancellation_url: `${appUrl}/booking/cancelled`,
      notification_id: ipnId,
      redirect_mode: "PARENT_WINDOW",
      branch: "Jun Designs - Kigali",
      billing_address: billingAddress,
    };

    return await pesapalClient.submitOrder(submitReq);
  }

  /**
   * Query status from Pesapal
   */
  async getStatus(orderTrackingId: string): Promise<PesapalTransactionStatusResponse> {
    return await pesapalClient.getTransactionStatus(orderTrackingId);
  }

  /**
   * Cancel order on Pesapal
   */
  async cancelOrder(orderTrackingId: string): Promise<PesapalCancelOrderResponse> {
    return await pesapalClient.cancelOrder(orderTrackingId);
  }

  /**
   * Request refund via Pesapal API 3.0
   */
  async requestRefund(
    confirmationCode: string,
    amountRwf: number,
    remarks: string,
    username = "admin"
  ): Promise<PesapalRefundResponse> {
    return await pesapalClient.refundRequest({
      confirmation_code: confirmationCode,
      amount: amountRwf.toFixed(2),
      username,
      remarks: remarks.slice(0, 200),
    });
  }
}

export const pesapalProvider = new PesapalProvider();
