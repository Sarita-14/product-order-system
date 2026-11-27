// ─────────────────────────────────────────────────────────────────────────────
// FILE: razorpay-webhook-event.interface.ts — the part of Razorpay's webhook JSON we read.
// (What an interface is: see auth/interfaces/jwt-payload.interface.ts.)
//
// Example body Razorpay sends:
//   { "event": "payment.captured",
//     "payload": { "payment": { "entity": { "id": "pay_X", "order_id": "order_Y", ... } } } }
// ─────────────────────────────────────────────────────────────────────────────

// The events we act on; any other event is accepted and ignored.
export const RAZORPAY_PAID_EVENTS = ['payment.captured', 'order.paid'];
export const RAZORPAY_FAILED_EVENT = 'payment.failed';

export interface RazorpayWebhookEvent {
  event: string; // e.g. "payment.captured"
  payload?: {
    payment?: {
      entity?: {
        id: string; // Razorpay's payment id ("pay_...")
        order_id: string; // Razorpay's order id ("order_...") = orders.razorpay_order_id
      };
    };
  };
}
