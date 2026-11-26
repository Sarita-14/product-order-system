'use server';
// ─────────────────────────────────────────────────────────────────────────────
// FILE: actions/admin-order.actions.ts — admin: change an order's status.
// (Server Action concept: see lib/form.ts. revalidatePath: see order.actions.ts.)
// ─────────────────────────────────────────────────────────────────────────────

// Mark pages as needing fresh data.
import { revalidatePath } from 'next/cache';
// Shared action helpers.
import { attempt, text, type FormState } from '@/lib/form';
// URL helpers.
import { ADMIN_PATHS, orderPath } from '@/lib/routes';
// The backend call (renamed with "as").
import { updateOrderStatus as updateStatusApi } from '@/services/order.service';
// The list of statuses (type).
import type { OrderStatus } from '@/types/order';

// The admin table fills in order id ahead of time ("bind"): updateOrderStatus.bind(null, order.id)
export async function updateOrderStatus(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  // The chosen status from the <select name="status">. "as OrderStatus" = treat the text as a status.
  const status = text(formData, 'status') as OrderStatus; // the backend validates it
  // Ask the backend to change it.
  const result = await attempt(() => updateStatusApi(id, status), 'Could not update the status');
  if (!result.ok) return result.state; // e.g. "Cannot change an order from X to Y"

  revalidatePath(ADMIN_PATHS.orders); // the admin orders table
  revalidatePath(ADMIN_PATHS.dashboard); // the admin counts
  revalidatePath('/dashboard'); // the customer sees the new status
  revalidatePath(orderPath(id)); // the order page
}
