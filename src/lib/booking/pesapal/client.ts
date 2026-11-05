import type {
  PesapalAuthResponse,
  PesapalCancelOrderRequest,
  PesapalCancelOrderResponse,
  PesapalConfig,
  PesapalEnv,
  PesapalIPNRegistrationRequest,
  PesapalIPNRegistrationResponse,
  PesapalRefundRequest,
  PesapalRefundResponse,
  PesapalSubmitOrderRequest,
  PesapalSubmitOrderResponse,
  PesapalTransactionStatusResponse,
} from "./types";

const SANDBOX_BASE_URL = "https://cybqa.pesapal.com/pesapalv3";
const LIVE_BASE_URL = "https://pay.pesapal.com/v3";

export class PesapalClient {
  private token: string | null = null;
  private tokenExpiresAt: number | null = null;
  private inFlightAuthPromise: Promise<string> | null = null;

  private getConfig(): PesapalConfig {
    const env = (process.env.PESAPAL_ENV || "sandbox").toLowerCase() as PesapalEnv;
    const consumerKey = process.env.PESAPAL_CONSUMER_KEY || "";
    const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET || "";
    const ipnId = process.env.PESAPAL_IPN_ID || "";
    const appUrl = (process.env.APP_URL || "http://localhost:3000").replace(/\/+$/, "");

    if (!consumerKey || !consumerSecret) {
      throw new Error(
        "Pesapal configuration error: PESAPAL_CONSUMER_KEY and PESAPAL_CONSUMER_SECRET must be configured."
      );
    }

    return {
      env,
      consumerKey,
      consumerSecret,
      ipnId,
      appUrl,
    };
  }

  public getBaseUrl(): string {
    const env = (process.env.PESAPAL_ENV || "sandbox").toLowerCase();
    return env === "live" ? LIVE_BASE_URL : SANDBOX_BASE_URL;
  }

  /**
   * Acquire authentication bearer token.
   * Caches token in memory and reuses it until 30 seconds before expiry.
   * Coalesces concurrent calls into a single in-flight Promise.
   */
  public async getAuthToken(forceRefresh = false): Promise<string> {
    const now = Date.now();

    // Check existing valid token if not forcing refresh (30s buffer)
    if (
      !forceRefresh &&
      this.token &&
      this.tokenExpiresAt &&
      this.tokenExpiresAt - now > 30 * 1000
    ) {
      return this.token;
    }

    // Coalesce in-flight auth requests
    if (this.inFlightAuthPromise) {
      return this.inFlightAuthPromise;
    }

    this.inFlightAuthPromise = (async () => {
      try {
        const config = this.getConfig();
        const baseUrl = this.getBaseUrl();

        const res = await fetch(`${baseUrl}/api/Auth/RequestToken`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            consumer_key: config.consumerKey,
            consumer_secret: config.consumerSecret,
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(
            `Pesapal Auth failed (${res.status}): ${errText || res.statusText}`
          );
        }

        const data: PesapalAuthResponse = await res.json();

        if (data.status !== "200" || !data.token) {
          throw new Error(
            `Pesapal Auth error: ${data.message || JSON.stringify(data.error) || "No token returned"}`
          );
        }

        this.token = data.token;

        // Parse expiry or default to 4.5 minutes
        if (data.expiryDate) {
          const parsed = new Date(data.expiryDate).getTime();
          this.tokenExpiresAt = isNaN(parsed) ? now + 270 * 1000 : parsed;
        } else {
          this.tokenExpiresAt = now + 270 * 1000;
        }

        return this.token;
      } finally {
        this.inFlightAuthPromise = null;
      }
    })();

    return this.inFlightAuthPromise;
  }

  /**
   * Clear cached token (e.g. after 401 Unauthorized)
   */
  public invalidateToken(): void {
    this.token = null;
    this.tokenExpiresAt = null;
  }

  /**
   * Internal authenticated fetch wrapper with automatic 401 retry.
   */
  private async authFetch<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    const token = await this.getAuthToken();
    const baseUrl = this.getBaseUrl();
    const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...((options.headers as Record<string, string>) || {}),
    };

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 401 && retryCount === 0) {
      // Evict token and retry once
      this.invalidateToken();
      return this.authFetch<T>(endpoint, options, 1);
    }

    if (!res.ok) {
      let errorBody = "";
      try {
        errorBody = await res.text();
      } catch {
        errorBody = res.statusText;
      }
      throw new Error(`Pesapal API Error ${res.status} on ${endpoint}: ${errorBody}`);
    }

    return (await res.json()) as T;
  }

  /**
   * Get list of registered IPN URLs
   */
  public async getIpnList(): Promise<PesapalIPNRegistrationResponse[]> {
    return this.authFetch<PesapalIPNRegistrationResponse[]>(
      "/api/URLSetup/GetIPNList",
      { method: "GET" }
    );
  }

  /**
   * Register a new IPN URL
   */
  public async registerIpn(
    url: string,
    ipnNotificationType: "GET" | "POST" = "GET"
  ): Promise<PesapalIPNRegistrationResponse> {
    const body: PesapalIPNRegistrationRequest = {
      url,
      ipn_notification_type: ipnNotificationType,
    };
    return this.authFetch<PesapalIPNRegistrationResponse>(
      "/api/URLSetup/RegisterIPN",
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );
  }

  /**
   * Submit order to Pesapal
   */
  public async submitOrder(
    order: PesapalSubmitOrderRequest
  ): Promise<PesapalSubmitOrderResponse> {
    return this.authFetch<PesapalSubmitOrderResponse>(
      "/api/Transactions/SubmitOrderRequest",
      {
        method: "POST",
        body: JSON.stringify(order),
      }
    );
  }

  /**
   * Query transaction status by order tracking ID
   */
  public async getTransactionStatus(
    orderTrackingId: string
  ): Promise<PesapalTransactionStatusResponse> {
    const encoded = encodeURIComponent(orderTrackingId);
    return this.authFetch<PesapalTransactionStatusResponse>(
      `/api/Transactions/GetTransactionStatus?orderTrackingId=${encoded}`,
      { method: "GET" }
    );
  }

  /**
   * Cancel an order in Pesapal
   */
  public async cancelOrder(
    orderTrackingId: string
  ): Promise<PesapalCancelOrderResponse> {
    const body: PesapalCancelOrderRequest = { order_tracking_id: orderTrackingId };
    return this.authFetch<PesapalCancelOrderResponse>(
      "/api/Transactions/CancelOrder",
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );
  }

  /**
   * Request a refund for a completed transaction
   */
  public async refundRequest(
    refund: PesapalRefundRequest
  ): Promise<PesapalRefundResponse> {
    return this.authFetch<PesapalRefundResponse>(
      "/api/Transactions/RefundRequest",
      {
        method: "POST",
        body: JSON.stringify(refund),
      }
    );
  }
}

export const pesapalClient = new PesapalClient();
