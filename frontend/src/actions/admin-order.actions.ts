'use server';
// FILE: actions/admin-order.actions.ts — admin: change an order's status.
// (Server Action concept: see lib/form.ts. revalidatePath: see order.actions.ts.)
// Mark pages as needing fresh data.
import { revalidatePath } from 'next/cache';
import { attempt, text, type FormState } from '@/lib/form';
import { ADMIN_PATHS, orderPath } from '@/lib/routes';
import { updateOrderStatus as updateStatusApi } from '@/services/order.service';
import type { OrderStatus } from '@/types/order';

export async function updateOrderStatus(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const status = text(formData, 'status') as OrderStatus; // the backend validates it
  // Ask the backend to change it.
  const result = await attempt(() => updateStatusApi(id, status), 'Could not update the status');
  if (!result.ok) return result.state; // Checks if the request failed. The ! means "NOT" (so, "if result.ok is false").
  //basically means no neet to reload 
  revalidatePath(ADMIN_PATHS.orders); 
  revalidatePath(ADMIN_PATHS.dashboard); // Refresh the Customer Dashboard
  revalidatePath('/dashboard');
  revalidatePath(orderPath(id)); 
}
