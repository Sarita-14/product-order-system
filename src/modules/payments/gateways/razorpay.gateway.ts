// ─────────────────────────────────────────────────────────────────────────────
// FILE: razorpay.gateway.ts — the ONLY place that talks to Razorpay.
//
// CONCEPT — "gateway": like a repository, but for an OUTSIDE service instead of
//   our database. Use cases call it and never touch the Razorpay SDK themselves,
//   so swapping Razorpay for another provider would only change this file.
//
// CONCEPT — how a Razorpay payment works (3 steps):
//   1. Our server creates a Razorpay "order" for the amount  -> createOrder()
//   2. The browser opens Razorpay's popup; the customer pays there.
//      Razorpay hands the browser: payment id + order id + a "signature".
//   3. Our server checks the signature with our SECRET key     -> isSignatureValid()
//      Only Razorpay and we know the secret, so a valid signature proves the
//      payment really happened (the browser can't fake it).
//   (+) Razorpay ALSO calls our backend directly (a "webhook") -> isWebhookSignatureValid()
//      so a payment is confirmed even if the customer closes the tab before step 3.
// ─────────────────────────────────────────────────────────────────────────────

// createHmac = builds the signature; timingSafeEqual = compares two signatures safely.
import { createHmac, timingSafeEqual } from 'node:crypto';
// ServiceUnavailableException = a 503 error ("this feature is not available right now").
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
// ConfigService = reads values from .env.
import { ConfigService } from '@nestjs/config';
// The official Razorpay SDK (npm package "razorpay").
import Razorpay from 'razorpay';

// What createOrder gives back to the use case.
export interface GatewayOrder {
  id: string; // Razorpay's order id, e.g. "order_Abc123"
  amount: number; // in PAISE (₹499.00 -> 49900)
  currency: string; // "INR"
}

@Injectable()
export class RazorpayGateway {
  // The keys from .env (undefined when not set).
  private readonly keyId?: string;
  private readonly keySecret?: string;
  // A DIFFERENT secret, chosen by you when creating the webhook in the Razorpay dashboard.
  private readonly webhookSecret?: string;
  // The SDK client; created only when both keys exist.
  private readonly client?: Razorpay;

  // Nest hands us ConfigService ready to use.
  constructor(config: ConfigService) {
    this.keyId = config.get<string>('RAZORPAY_KEY_ID');
    this.keySecret = config.get<string>('RAZORPAY_KEY_SECRET');
    this.webhookSecret = config.get<string>('RAZORPAY_WEBHOOK_SECRET');
    // Both keys present -> make the client. Otherwise leave it empty (payments "not configured").
    if (this.keyId && this.keySecret) {
      this.client = new Razorpay({ key_id: this.keyId, key_secret: this.keySecret });
    }
  }

  // The PUBLIC key id; the browser needs it to open the popup (safe to share, unlike the secret).
  get publicKeyId(): string {
    return this.requireConfig().keyId;
  }

  // Step 1: ask Razorpay to create an order for `amountInRupees`.
  // receipt = our own order id, so the payment can be found in the Razorpay dashboard.
  async createOrder(amountInRupees: number, receipt: string): Promise<GatewayOrder> {
    const { client } = this.requireConfig();
    // Razorpay counts in paise (1 rupee = 100 paise). Math.round removes float leftovers like 49899.99999.
    const order = await client.orders.create({
      amount: Math.round(amountInRupees * 100),
      currency: 'INR',
      receipt,
    });
    // Return only what we need, as plain values (Number(...) because the SDK types say "number | string").
    return { id: order.id, amount: Number(order.amount), currency: order.currency };
  }

  // Step 3: is this signature really from Razorpay for this order + payment?
  isSignatureValid(razorpayOrderId: string, razorpayPaymentId: string, signature: string): boolean {
    const { keySecret } = this.requireConfig();
    // Razorpay's rule: signature = HMAC-SHA256 of "<order id>|<payment id>" with the KEY secret.
    return hmacMatches(`${razorpayOrderId}|${razorpayPaymentId}`, keySecret, signature);
  }

  // Webhook: is this request really from Razorpay? rawBody = the exact bytes Razorpay sent.
  isWebhookSignatureValid(rawBody: Buffer, signature: string): boolean {
    if (!this.webhookSecret) {
      throw new ServiceUnavailableException('Razorpay webhook is not configured (set RAZORPAY_WEBHOOK_SECRET)');
    }
    // Razorpay's rule: header X-Razorpay-Signature = HMAC-SHA256 of the raw body with the WEBHOOK secret.
    return hmacMatches(rawBody, this.webhookSecret, signature);
  }

  // Keys missing -> 503 with a clear message. Otherwise give back the ready keys + client.
  private requireConfig(): { keyId: string; keySecret: string; client: Razorpay } {
    if (!this.keyId || !this.keySecret || !this.client) {
      throw new ServiceUnavailableException(
        'Online payment is not configured (set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in the backend .env)',
      );
    }
    return { keyId: this.keyId, keySecret: this.keySecret, client: this.client };
  }
}

// Shared by both checks above (written once): does `signature` equal HMAC-SHA256(data, secret) in hex?
// CONCEPT — HMAC: a "fingerprint" of the data that can only be made with the secret.
function hmacMatches(data: string | Buffer, secret: string, signature: string): boolean {
  // The fingerprint WE compute, as hex text (0-9, a-f).
  const expected = createHmac('sha256', secret).update(data).digest('hex');
  // Turn both into bytes to compare them.
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  // timingSafeEqual takes the same time whether the first or last letter differs,
  // so an attacker can't guess the signature letter by letter. It needs equal lengths.
  return a.length === b.length && timingSafeEqual(a, b);
}
