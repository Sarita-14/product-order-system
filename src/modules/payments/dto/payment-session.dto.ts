// ─────────────────────────────────────────────────────────────────────────────
// FILE: payment-session.dto.ts — what POST /orders/:id/payment answers.
// The browser passes these values straight to Razorpay's popup.
// (Plain // comments, not /** */: the Swagger plugin turns JSDoc into API docs.)
// ─────────────────────────────────────────────────────────────────────────────

export class PaymentSessionDto {
  // Our order id (which order is being paid).
  // @example "72a7290d-222f-497e-8b06-51c10eabe5ee"
  orderId: string;

  // Razorpay's PUBLIC key id: the popup needs it. (The secret never leaves the server.)
  // @example "rzp_test_1DP5mmOlF5G5ag"
  keyId: string;

  // Razorpay's order id for this payment attempt.
  // @example "order_Abc123"
  razorpayOrderId: string;

  // The amount in PAISE (₹499.00 = 49900), as Razorpay expects.
  // @example 49900
  amount: number;

  // @example "INR"
  currency: string;

  // Pre-filled in the popup so the customer doesn't type them again.
  // @example "anjali"
  customerName: string;

  // @example "anjali@example.com"
  customerEmail: string;
}
