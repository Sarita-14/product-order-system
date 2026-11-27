// ─────────────────────────────────────────────────────────────────────────────
// FILE: services/order.service.ts — all order API calls live here.
// ─────────────────────────────────────────────────────────────────────────────

// Our HTTP helper.
import { http } from '@/lib/axios';
// The shapes we receive / send.
import type { Order, OrderStatus } from '@/types/order';

// Customer (the backend takes the customer from the token, never from the body).
// Orders are placed from the cart: see services/cart.service.ts.
// GET /orders/my -> my orders, newest first
export const getMyOrders = () => http.get<Order[]>('/orders/my');
// GET /orders/<id> -> one order
export const getOrderById = (id: string) => http.get<Order>(`/orders/${id}`); // own order, or any for admin
// PATCH /orders/<id>/cancel -> the cancelled order
export const cancelOrder = (id: string) => http.patch<Order>(`/orders/${id}/cancel`);

// Admin only
// GET /orders -> every order
export const getAllOrders = () => http.get<Order[]>('/orders');
// PATCH /orders/<id>/status { status } -> the updated order
export const updateOrderStatus = (id: string, status: OrderStatus) =>
  http.patch<Order>(`/orders/${id}/status`, { status });
