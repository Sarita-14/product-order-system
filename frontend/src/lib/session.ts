// ─────────────────────────────────────────────────────────────────────────────
// FILE: lib/session.ts — saves / reads / deletes the login token cookie.
//
// Stores the JWT in an httpOnly cookie.
// httpOnly = browser JavaScript can't read it (so a hacker's script sneaked into a page can't steal it), but the browser
// sends it to Next.js with every request, so server code can read it.
//
// CONCEPT — "cookie": a small named value the browser keeps for a website
//   and sends back automatically with every request to that website.
// ─────────────────────────────────────────────────────────────────────────────

// cookies() = Next.js function to read/write the cookies of the current request (server only).
import { cookies } from 'next/headers';

export const TOKEN_COOKIE = 'token'; // proxy.ts checks for it too
const ONE_DAY = 60 * 60 * 24; // seconds; same as JWT_EXPIRES_IN=1d in the backend

// Read the token, or undefined if there is no cookie (visitor).
// "async" + "await": cookies() takes a moment, so we wait for it.
export async function getToken(): Promise<string | undefined> {
  // .get(name)?.value = the cookie's value; "?." = don't crash if it's missing.
  return (await cookies()).get(TOKEN_COOKIE)?.value;
}

// set/delete only work inside Server Actions (form submits) and Route Handlers
export async function saveToken(token: string): Promise<void> {
  (await cookies()).set(TOKEN_COOKIE, token, {
    httpOnly: true, // browser JavaScript can't read it
    secure: process.env.NODE_ENV === 'production', // HTTPS-only on the live site
    sameSite: 'lax', // not sent on requests started by other websites (so another website can't secretly act on our site in your name)
    path: '/', // valid for every page of the site
    maxAge: ONE_DAY, // the browser deletes it after one day
  });
}

// Remove the cookie = log out.
export async function deleteToken(): Promise<void> {
  (await cookies()).delete(TOKEN_COOKIE);
}
