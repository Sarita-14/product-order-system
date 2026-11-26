// Stores the JWT from NestJS in an httpOnly cookie.
// httpOnly = browser JavaScript can't read it (safe from XSS), but the browser
// sends it to Next.js on every request, so Server Components / Server Actions
// can read it and forward it to the API as "Authorization: Bearer <token>".
// Only import this from server code (Server Components, Server Actions).
import { cookies } from 'next/headers';

export const TOKEN_COOKIE = 'token';
const ONE_DAY = 60 * 60 * 24; // keep in sync with JWT_EXPIRES_IN in the backend .env

export async function getToken(): Promise<string | undefined> {
  return (await cookies()).get(TOKEN_COOKIE)?.value;
}

// cookies().set / delete only work in Server Actions and Route Handlers
export async function saveToken(token: string): Promise<void> {
  (await cookies()).set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // https only in production
    sameSite: 'lax',
    path: '/',
    maxAge: ONE_DAY,
  });
}

export async function deleteToken(): Promise<void> {
  (await cookies()).delete(TOKEN_COOKIE);
}