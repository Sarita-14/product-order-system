// ─────────────────────────────────────────────────────────────────────────────
// FILE: lib/not-found.ts — turns "the API says it doesn't exist" into the 404 page.
// Used by: product page, order page, admin edit-product page.
// ─────────────────────────────────────────────────────────────────────────────

// notFound() = Next.js function that stops the page and shows the 404 page.
import { notFound } from 'next/navigation';
// Our error type (has .status).
import { ApiError } from './axios';

// For detail pages: "the API said it doesn't exist" -> show the 404 page.
// 404 = no such record; 400 = the id in the URL isn't even in the right id format.
const isMissing = (error: unknown) =>
  error instanceof ApiError && (error.status === 404 || error.status === 400);

// Give it an API call (a "Promise" = a value that arrives later); get the value, or the 404 page.
export async function findOrNotFound<T>(request: Promise<T>): Promise<T> {
  // .catch(...) = if the call fails, run this function instead of crashing.
  const result = await request.catch((error: unknown) => {
    if (isMissing(error)) return null; // "doesn't exist" -> null
    throw error; // any other problem -> the error page
  });
  // notFound() is called here, OUTSIDE any try/catch, so Next can catch it
  if (result === null) notFound();
  // It exists: hand it back.
  return result;
}
