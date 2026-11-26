// ─────────────────────────────────────────────────────────────────────────────
// FILE: lib/auth.ts — "Who is logged in?" helpers for server code (pages, layouts, header).
// DATA COMES FROM: the token cookie (session.ts) + GET /auth/me (auth.service.ts).
// ─────────────────────────────────────────────────────────────────────────────

// cache() = remember a function's answer for the rest of ONE request.
import { cache } from 'react';
// notFound() = show the 404 page; redirect() = send the browser to another URL.
import { notFound, redirect } from 'next/navigation';
// Asks the backend "who owns this token?".
import { getMe } from '@/services/auth.service';
// The User shape.
import type { User } from '@/types/user';
// Reads the token cookie.
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
