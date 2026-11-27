import type { Product } from './product';

// Same values as the backend OrderStatus enum.
// The "|" means "or": a status is exactly one of these texts.
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'FAILED';

export const ORDER_STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'FAILED',
];

export const CANCELLABLE_STATUSES: OrderStatus[] = ['PENDING', 'FAILED'];
export const PAYABLE_STATUSES: OrderStatus[] = ['PENDING', 'FAILED'];
export const NEXT_ADMIN_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  CONFIRMED: 'SHIPPED',
  SHIPPED: 'DELIVERED',
};
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
