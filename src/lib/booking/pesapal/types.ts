export type PesapalEnv = "sandbox" | "live";

export interface PesapalConfig {
  env: PesapalEnv;
  consumerKey: string;
  consumerSecret: string;
  ipnId: string;
  appUrl: string;
}

export interface PesapalAuthResponse {
  token: string;
  expiryDate: string; // UTC ISO string e.g. "2026-11-04T20:41:38.0266421Z"
  error: any;
  status: string; // "200"
  message: string;
}

export interface PesapalIPNRegistrationRequest {
  url: string;
  ipn_notification_type: "GET" | "POST";
}

export interface PesapalIPNRegistrationResponse {
  url: string;
  created_date: string;
  ipn_id: string; // GUID
  notification_type: number;
  ipn_notification_type_description: "GET" | "POST";
  ipn_status: number;
  ipn_status_description?: string;
  status: string; // "200"
  message?: string;
  error?: any;
}

export interface PesapalBillingAddress {
  email_address: string;
  phone_number: string;
  country_code: string; // ISO 3166-1 alpha-2 e.g. "RW", "US"
  first_name: string;
  last_name: string;
  line_1?: string;
  line_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  zip_code?: string;
}

export interface PesapalSubmitOrderRequest {
  id: string; // Merchant reference max 50 chars (only letters, digits, - _ . :)
  currency: "RWF";
  amount: number; // e.g. 50000.00
  description: string; // Max 100 chars
  callback_url: string;
  cancellation_url: string;
  notification_id: string; // Registered IPN GUID
  redirect_mode?: "PARENT_WINDOW" | "TOP_WINDOW";
  branch?: string; // "Jun Designs - Kigali"
  billing_address: PesapalBillingAddress;
}

export interface PesapalSubmitOrderResponse {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
  error: any;
  status: string; // "200"
}

export interface PesapalTransactionStatusResponse {
  payment_method: string;
  amount: number;
  created_date: string;
  confirmation_code: string;
  order_tracking_id: string;
  payment_status_description: "INVALID" | "FAILED" | "COMPLETED" | "REVERSED";
  description: string | null;
  message: string;
  payment_account: string;
  call_back_url: string;
  status_code: number; // 0 INVALID, 1 COMPLETED, 2 FAILED, 3 REVERSED
  merchant_reference: string;
  account_number: string | null;
  payment_status_code: string;
  currency: string;
  error: any;
  status: string; // "200"
}

export interface PesapalIPNReceiptResponse {
  orderNotificationType: "IPNCHANGE";
  orderTrackingId: string;
  orderMerchantReference: string;
  status: number; // 200
}

export interface PesapalRefundRequest {
  confirmation_code: string;
  amount: string; // e.g. "50000.00"
  username: string; // Admin who initiated
  remarks: string; // Reason
}

export interface PesapalRefundResponse {
  status: string; // "200"
  message: string;
  error?: any;
}

export interface PesapalCancelOrderRequest {
  order_tracking_id: string;
}

export interface PesapalCancelOrderResponse {
  status: string; // "200"
  message: string;
  error?: any;
}
