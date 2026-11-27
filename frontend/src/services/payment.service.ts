// ─────────────────────────────────────────────────────────────────────────────
// FILE: services/payment.service.ts — all payment (Razorpay) API calls live here.
// Every call needs the login token, so they use `http` (not publicHttp).
// ─────────────────────────────────────────────────────────────────────────────

// Our HTTP helper (sends the login token).
import { http } from '@/lib/axios';
// The shapes we receive / send.
import type { Order } from '@/types/order';
import type { PaymentProof, PaymentSession } from '@/types/payment';

// The start of every payment URL for one order: '/orders/<id>/payment' (written once).
const paymentUrl = (orderId: string) => `/orders/${orderId}/payment`;

// POST /orders/<id>/payment -> what Razorpay's popup needs
export const startPayment = (orderId: string) => http.post<PaymentSession>(paymentUrl(orderId));
// POST /orders/<id>/payment/verify { razorpayPaymentId, razorpaySignature } -> the CONFIRMED order
export const verifyPayment = (orderId: string, proof: PaymentProof) =>
  http.post<Order>(`${paymentUrl(orderId)}/verify`, proof);
// POST /orders/<id>/payment/fail -> the order, now FAILED
export const failPayment = (orderId: string) => http.post<Order>(`${paymentUrl(orderId)}/fail`);
