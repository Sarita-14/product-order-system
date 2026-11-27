// ─────────────────────────────────────────────────────────────────────────────
// FILE: services/cart.service.ts — all cart API calls live here (customers only,
// so they use `http`, which sends the login token).
// ─────────────────────────────────────────────────────────────────────────────

// Our HTTP helper (sends the login token).
import { http } from '@/lib/axios';
// The shapes we receive.
import type { CartItem } from '@/types/cart';
import type { Order } from '@/types/order';

// GET /cart -> my cart lines
export const getCart = () => http.get<CartItem[]>('/cart');
// POST /cart/items { productId } -> add one (the backend takes 1 from stock) -> the whole cart
export const addCartItem = (productId: string) => http.post<CartItem[]>('/cart/items', { productId });
// PATCH /cart/items/<id> { quantity } -> set it (0 = remove; stock moves by the difference) -> the whole cart
export const setCartQuantity = (productId: string, quantity: number) =>
  http.patch<CartItem[]>(`/cart/items/${productId}`, { quantity });
// POST /cart/checkout -> the whole cart becomes one PENDING order; the cart is emptied
export const checkoutCart = () => http.post<Order>('/cart/checkout');
