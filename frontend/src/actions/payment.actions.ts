'use server';
// FILE: actions/payment.actions.ts — the 3 steps of paying with Razorpay.
// (Server Action concept: see lib/form.ts.)

import { attempt, type AttemptResult, type FormState } from '@/lib/form';
// "An order changed" page refresh.
import { refreshOrderPages } from '@/lib/revalidate';
// The backend calls ("as" renames them, so they don't clash with this file's names).
import {
  failPayment as failPaymentApi,
  startPayment as startPaymentApi,
  verifyPayment as verifyPaymentApi,
} from '@/services/payment.service';
import type { PaymentProof, PaymentSession } from '@/types/payment';


export async function beginPayment(orderId: string): Promise<AttemptResult<PaymentSession>> {
  return attempt(() => startPaymentApi(orderId), 'Could not start the payment');
}

export async function confirmPayment(orderId: string, proof: PaymentProof): Promise<FormState> {
  const result = await attempt(() => verifyPaymentApi(orderId, proof), 'Could not verify the payment');
  //Sends orderId and proof to your NestJS backend 
  refreshOrderPages(orderId); //to show the updated version 
  return result.ok ? undefined : result.state;
}

//to mark this order as FAILED
export async function recordPaymentFailure(orderId: string): Promise<FormState> {
  const result = await attempt(() => failPaymentApi(orderId), 'Could not record the failed payment');
  refreshOrderPages(orderId);
  // Tell the customer what happened; they may try again from the same popup or later.
  return result.ok ? { error: 'The payment failed. You can try again.' } : result.state;
}
