'use server';
// ─────────────────────────────────────────────────────────────────────────────
// FILE: actions/user.actions.ts — admin: Make admin / Make customer (Admin → Users).
// (Server Action concept: see lib/form.ts.)
// The backend checks that the caller is an admin and isn't changing their own role.
// ─────────────────────────────────────────────────────────────────────────────

// Mark pages as needing fresh data.
import { revalidatePath } from 'next/cache';
import { attempt, type FormState } from '@/lib/form';
import { ADMIN_PATHS } from '@/lib/routes';
import { updateUserRole } from '@/services/user.service';
import type { Role } from '@/types/user';

export async function changeUserRole(id: string, role: Role): Promise<FormState> {
  const result = await attempt(() => updateUserRole(id, role), 'Could not change the role');
  if (!result.ok) return result.state; // e.g. "You cannot change your own role"

  revalidatePath(ADMIN_PATHS.users); // the table shows the new role
  return { success: `${result.data.username} is now ${role === 'admin' ? 'an admin' : 'a customer'}` };
}
