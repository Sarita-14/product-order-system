'use server';
// ─────────────────────────────────────────────────────────────────────────────
// FILE: actions/auth.actions.ts — login, register and logout.
// 'use server' (line 1) = every function in this file is a Server Action:
// it runs ON THE SERVER when a form is submitted. (Concept: see lib/form.ts.)
//
// DATA COMES FROM: the login / register forms (components/auth/*.tsx).
// ─────────────────────────────────────────────────────────────────────────────

// redirect() = send the browser to another page.
import { redirect } from 'next/navigation';
// attempt = run an API call safely; text = read a form field; FormState = what we answer the form.
import { attempt, text, type FormState } from '@/lib/form';
// Save / delete the token cookie.
import { deleteToken, saveToken } from '@/lib/session';
// The backend calls.
import { loginUser, registerUser } from '@/services/auth.service';

// Called by the login form. _prev = the previous answer (unused, hence "_").
export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  // Read the typed fields.
  const email = text(formData, 'email');
  const password = String(formData.get('password') ?? ''); // not trimmed: spaces may be part of it
  const from = text(formData, 'from'); // where to go after login (hidden field)

  // Call the backend; on success put the token in the httpOnly cookie.
  const result = await attempt(
    async () => saveToken((await loginUser(email, password)).accessToken), // JWT -> httpOnly cookie
    'Login failed',
    { email }, // on error, refill the email box
  );
  // Failed -> send the error back to the form (it shows it in red).
  if (!result.ok) return result.state;

  // Only follow same-site paths (blocks open redirects like //evil.com).
  const safeFrom = from.startsWith('/') && !from.startsWith('//') ? from : '/';
  // Logged in -> go there.
  redirect(safeFrom);
}

// Called by the register form.
export async function register(_prev: FormState, formData: FormData): Promise<FormState> {
  // The fields we send (and refill on error).
  const values = {
    username: text(formData, 'username'),
    email: text(formData, 'email'),
    phoneNumber: text(formData, 'phoneNumber'),
  };
  const password = String(formData.get('password') ?? '');

  // Both password boxes must match (checked here, before calling the backend).
  if (password !== formData.get('confirmPassword')) {
    return { error: 'Passwords do not match', values };
  }

  // Create the account ("...values" = copy all fields of values into the object).
  const result = await attempt(() => registerUser({ ...values, password }), 'Registration failed', values);
  if (!result.ok) return result.state;

  // Success -> login page with a "Account created" message.
  redirect('/login?registered=1');
}

// Called by the "Sign out" button.
export async function logout(): Promise<void> {
  await deleteToken(); // remove the cookie
  redirect('/'); // back to the home page
}
