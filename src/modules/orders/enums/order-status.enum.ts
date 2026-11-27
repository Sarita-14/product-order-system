// ─────────────────────────────────────────────────────────────────────────────
// FILE: order-status.enum.ts — every status an order can have, plus the rules
// for moving between them. (What an enum is: see users/enums/role.enum.ts.)
//
// The life of an order:
//   PENDING --pay--> CONFIRMED --admin--> SHIPPED --admin--> DELIVERED
//   PENDING / FAILED --customer cancels--> CANCELLED
// ─────────────────────────────────────────────────────────────────────────────

// The list of statuses. The text values are what the database stores.
export enum OrderStatus {
  PENDING = 'PENDING', // placed, waiting for payment
  CONFIRMED = 'CONFIRMED', // paid
  SHIPPED = 'SHIPPED', // sent by the shop
  DELIVERED = 'DELIVERED', // arrived
  CANCELLED = 'CANCELLED', // cancelled by the customer (stock given back)
  FAILED = 'FAILED', // payment failed
}

// The status rules live here, in ONE place, so use cases never hard-code them.

/** A customer may cancel only while nothing has been paid/shipped. */
export const CANCELLABLE_STATUSES = [OrderStatus.PENDING, OrderStatus.FAILED];

/** A customer may pay only an unpaid order: PENDING, or FAILED (= try again). */
export const PAYABLE_STATUSES = [OrderStatus.PENDING, OrderStatus.FAILED];

/** The only moves an admin may make: current status -> the one allowed next status. */
// Partial<Record<A, B>> = "an object whose keys are some of A, and values are B".
// Read it as a lookup table: NEXT_ADMIN_STATUS[CONFIRMED] is SHIPPED.
export const NEXT_ADMIN_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  [OrderStatus.CONFIRMED]: OrderStatus.SHIPPED, // confirmed -> may become shipped
  [OrderStatus.SHIPPED]: OrderStatus.DELIVERED, // shipped -> may become delivered
};
