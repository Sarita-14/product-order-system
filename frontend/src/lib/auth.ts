// DATA COMES FROM: the token cookie (session.ts) + GET /auth/me (auth.service.ts).
import { cache } from 'react';
import { notFound, redirect } from 'next/navigation';
import { getMe } from '@/services/auth.service';
import type { User } from '@/types/user';
import { ADMIN_PATHS } from './routes';
import { getToken } from './session';

// Returns the logged-in user, or null for visitors.
// cache() = asked several times in one request (header + page) -> API called once.
export const getCurrentUser = cache(async (): Promise<User | null> => {
  if (!(await getToken())) return null; // no cookie = not logged in
  try {
    return await getMe(); // backend checks the token
  } catch {
    return null; // expired/invalid token or backend down -> treat as visitor
  }
});

// For private pages: returns the user, or sends the visitor to /login
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  // Not logged in -> go to the login page (redirect stops this function here).
  if (!user) redirect('/login');
  return user;
}

// For admin pages: visitors -> /login; customers -> 404,
// so they never even learn that an admin area exists.
export async function requireAdmin(): Promise<User> {
  // Reuse requireUser (handles visitors).
  const user = await requireUser();
  // Logged in but not an admin -> pretend the page doesn't exist.
  if (user.role !== 'admin') notFound();
  return user;
}

// For shopping pages (cart, checkout, my orders): visitors -> /login; admins -> their dashboard.
// Admins manage the shop and don't buy from it (the backend refuses their orders too).
export async function requireCustomer(): Promise<User> {
  const user = await requireUser();
  if (user.role === 'admin') redirect(ADMIN_PATHS.dashboard);
  return user;
}

// Where someone lands after logging in: admins -> admin dashboard; customers -> the page
// they came from (`from`), or the shop. A customer is never sent into /admin.
export function homeFor(role: User['role'], from?: string): string {
  if (role === 'admin') return ADMIN_PATHS.dashboard;
  // Only same-site paths (blocks open redirects like //evil.com), and never the admin area.
  const safe = from && from.startsWith('/') && !from.startsWith('//') && !from.startsWith(ADMIN_PATHS.dashboard);
  return safe ? from : '/';
}
