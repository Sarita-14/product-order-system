// ─────────────────────────────────────────────────────────────────────────────
// FILE: lib/form.ts — small helpers shared by every Server Action in src/actions/.
//
// CONCEPT — "Server Action": a function marked 'use server' that runs ON THE
//   SERVER when a <form> is submitted. The browser sends the form fields
//   (as FormData); the action calls the backend and answers the form.
//
// CONCEPT — "FormData": the browser's bag of submitted fields.
//   formData.get('email') gives the value of the input named "email".
// ─────────────────────────────────────────────────────────────────────────────

// Our error type (has a clean message from the backend).
import { ApiError } from './axios';

// What an action sends back to its form: an error + what the user typed
// "| undefined" = or nothing at all (= it worked, or the form is shown for the first time).
export type FormState = { error?: string; values?: Record<string, string> } | undefined;

// The shape (inputs and output) every form action has (useActionState calls it like this)
// It receives the previous state + the submitted fields, and returns the new state.
export type FormAction = (state: FormState, formData: FormData) => Promise<FormState>;

// The checkout form names each quantity input "qty-<productId>"
export const QTY_PREFIX = 'qty-';

// A trimmed text field from the submitted form ('' when missing)
// String(... ?? '') = turn it into text (empty if missing); .trim() = remove spaces at both ends.
export const text = (formData: FormData, name: string) => String(formData.get(name) ?? '').trim();

// Runs one API call. Success -> { ok: true, data }. Failure -> { ok: false, state }
// where state is ready to return to the form. Replaces a try/catch in every action,
// and keeps redirect() OUTSIDE try/catch (the action calls it after checking ok).
export async function attempt<T>(
  work: () => Promise<T>, // the API call to make
  fallback: string, // message to show if the error has no clear message
  values?: Record<string, string>, // what the user typed (to refill the form)
): Promise<{ ok: true; data: T } | { ok: false; state: FormState }> {
  try {
    // Run the call and wait for its answer.
    return { ok: true, data: await work() };
  } catch (error) {
    // Our ApiError has the backend's message; anything else gets the backup text.
    const message = error instanceof ApiError ? error.message : fallback;
    return { ok: false, state: { error: message, values } };
  }
}
