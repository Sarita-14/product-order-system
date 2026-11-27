'use server';
// FILE: actions/order.actions.ts — cancel an order. (Placing one: see actions/cart.actions.ts.)
import { attempt, type FormState } from '@/lib/form';
import { refreshShop } from '@/lib/revalidate';
import { cancelOrder as cancelOrderApi } from '@/services/order.service';

// (.bind fixes the first argument in advance, so the form doesn't need a hidden id field.)
export async function cancelOrder(id: string): Promise<FormState> {
  const result = await attempt(() => cancelOrderApi(id), 'Could not cancel the order');
  if (!result.ok) return result.state;

  refreshShop(); 
}
