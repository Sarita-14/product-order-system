// ─────────────────────────────────────────────────────────────────────────────
// FILE: types/cart.ts — what a cart line looks like in the frontend.
// DATA COMES FROM: GET /cart, POST /cart/items, PATCH /cart/items/:id (backend).
//
// The cart lives in the DATABASE (one cart per customer). Its quantities are
// RESERVED: adding 1 takes 1 out of the product's stock straight away.
// ─────────────────────────────────────────────────────────────────────────────

// We only need the Product shape (type).
import type { Product } from './product';

// One line of the cart.
export interface CartItem {
  id: string; // the line's own id
  productId: string; // which product
  quantity: number; // how many are reserved for this customer
  product: Product; // the product itself (name, price, stock LEFT for others)
}

// How many items in total (for "Cart (3)" in the header). reduce = add them up.
export const countItems = (items: CartItem[]) => items.reduce((total, item) => total + item.quantity, 0);

// The grand total: price × quantity for every line, added up.
export const cartTotal = (items: CartItem[]) =>
  items.reduce((total, { product, quantity }) => total + product.price * quantity, 0);
