'use server';
// ─────────────────────────────────────────────────────────────────────────────
// FILE: actions/auth.actions.ts — login, register and logout.
// redirect() = send the browser to another page.
import { redirect } from 'next/navigation';
// attempt = run an API call safely; text = read a form field; FormState = what we answer the form.
import { attempt, text, type FormState } from '@/lib/form';
// Where to go after login (depends on the role).
import { homeFor } from '@/lib/auth';
// Save / delete the token cookie.
import { deleteToken, saveToken } from '@/lib/session';
// The backend calls.
import { loginUser, registerUser } from '@/services/auth.service';

// Called by the login form. _prev = the previous answer (unused, hence "_").
export async function login(_prev: FormState, formData: FormData): Promise<FormState> {

  // Read the typed fields.
  const email = text(formData, 'email');
  const password = String(formData.get('password') ?? ''); // not trimmed: spaces may be part of it
  const from = text(formData, 'from'); // where to go after login 
  
  // Step 2 (Authenticate & Save Cookie):
  // Call the backend; on success put the token in the httpOnly cookie and keep the user (for the role).
  const result = await attempt(
    async () => {
      const { accessToken, user } = await loginUser(email, password);
      await saveToken(accessToken); // JWT -> httpOnly cookie
      return user;
    },
    'Login failed',
    { email }, // on error, refill the email box 
  );
  // Step 3 (Handle Failure or Redirect):
  // Failed -> send the error back to the form (it shows it in red).
  if (!result.ok) return result.state;

  // Logged in -> admins to the admin dashboard, customers back where they were.
  redirect(homeFor(result.data.role, from));
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
