// ─────────────────────────────────────────────────────────────────────────────
// FILE: types/order.ts — what an order looks like, plus the status rules.
// DATA COMES FROM: GET /orders, /orders/my, /orders/:id (backend).
// ─────────────────────────────────────────────────────────────────────────────

// We only need the Product shape (type), so "import type".
import type { Product } from './product';

// Same values as the backend OrderStatus enum.
// The "|" means "or": a status is exactly one of these texts.
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'FAILED';

// The same statuses as a LIST, so we can loop over them (admin dashboard counts).
export const ORDER_STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'FAILED',
];

// The same rules the backend enforces; here only to decide which buttons to SHOW.
// (The backend still checks them, so a tampered form gets a 400.)
// Statuses that still allow "Cancel" (and the Pay placeholder).
export const CANCELLABLE_STATUSES: OrderStatus[] = ['PENDING', 'FAILED'];
// Lookup table: current status -> the next status an admin may set.
export const NEXT_ADMIN_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  CONFIRMED: 'SHIPPED',
  SHIPPED: 'DELIVERED',
};

// One line of an order. unitPrice is the price at order time (a copy saved at that moment).
export interface OrderItem {
  id: string; // the line's own id
  productId: string; // which product
  quantity: number; // how many
  unitPrice: number; // price of one, when ordered
  subtotal: number; // unitPrice × quantity
  product: Product; // the product itself (we show its name)
}

// One order.
export interface Order {
  id: string; // unique id: a long random code like 4f1c2b8d-...
  userId: string; // who placed it
  customerName: string; // their username at order time
  customerEmail: string; // their email at order time
  totalAmount: number; // sum of all subtotals
  status: OrderStatus; // where the order is in its life
  createdAt: string; // when it was placed (text)
  updatedAt: string; // last change (text)
  items: OrderItem[]; // the lines
}

// What the checkout form sends: one entry per product with quantity > 0
export type OrderItemInput = Pick<OrderItem, 'productId' | 'quantity'>;
