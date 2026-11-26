'use server';
// ─────────────────────────────────────────────────────────────────────────────
// FILE: actions/order.actions.ts — place an order (checkout) and cancel an order.
// (Server Action concept: see lib/form.ts.)
//
// CONCEPT — revalidatePath('/x'): "the data shown on page /x changed; draw it
//   fresh next time". Used after something changes (stock, status...).
// ─────────────────────────────────────────────────────────────────────────────

// Mark pages as needing fresh data.
import { revalidatePath } from 'next/cache';
// Send the browser to another page.
import { redirect } from 'next/navigation';
// Shared action helpers.
import { attempt, QTY_PREFIX, type FormState } from '@/lib/form';
// Builds "/orders/<id>".
import { orderPath } from '@/lib/routes';
// The backend calls ("as" renames them, so they don't clash with this file's own names).
import { cancelOrder as cancelOrderApi, placeOrder as placeOrderApi } from '@/services/order.service';
// The shape of one order line we send.
import type { OrderItemInput } from '@/types/order';

// Checkout form -> [{ productId, quantity }] (products left at 0 are skipped)
function readItems(formData: FormData): OrderItemInput[] {
  // [...formData.entries()] = every field as a [name, value] pair.
  return [...formData.entries()]
    // keep only the quantity boxes ("qty-<id>")
    .filter(([name]) => name.startsWith(QTY_PREFIX))
    // "qty-abc" -> productId "abc"; the value text -> a number
    .map(([name, value]) => ({ productId: name.slice(QTY_PREFIX.length), quantity: Number(value) }))
    // keep only whole numbers above 0
    .filter(({ quantity }) => Number.isInteger(quantity) && quantity > 0);
}

// Called by the checkout form.
export async function placeOrder(_prev: FormState, formData: FormData): Promise<FormState> {
  // What the customer chose.
  const items = readItems(formData);
  // Nothing chosen -> tell them.
  if (items.length === 0) return { error: 'Choose a quantity for at least one product' };

  // Ask the backend to place the order.
  const result = await attempt(() => placeOrderApi(items), 'Could not place the order');
  // E.g. "Insufficient stock..." -> shown on the form.
  if (!result.ok) return result.state;

  revalidatePath('/'); // stock went down on the product list
  // Go to the new order's page. result.data = the order the backend returned.
  redirect(orderPath(result.data.id));
}

// The page fills in order id ahead of time ("bind"): cancelOrder.bind(null, order.id)
// (.bind fixes the first argument in advance, so the form doesn't need a hidden id field.)
export async function cancelOrder(id: string): Promise<FormState> {
  // Ask the backend to cancel.
  const result = await attempt(() => cancelOrderApi(id), 'Could not cancel the order');
  if (!result.ok) return result.state;

  revalidatePath('/'); // stock came back
  revalidatePath('/dashboard'); // the order list shows the new status
  revalidatePath(orderPath(id)); // the order page shows the new status
}
