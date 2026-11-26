'use server';
// Server Actions: run on the Next.js server when a form is submitted.
// That's why they can call the backend AND set the httpOnly cookie.
import { redirect } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/server-api';
import { deleteToken, saveToken } from '@/lib/session';

// `values` = what the user typed, sent back so the form can refill it
// (React resets a form after its action runs)
export type FormState = { error?: string; values?: Record<string, string> } | undefined;

type LoginResponse = {
  accessToken: string;
  user: { id: string; username: string; email: string };
};

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const data = await apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { email: formData.get('email'), password: formData.get('password') },
    });
    await saveToken(data.accessToken);
  } catch (e) {
    return {
      error: e instanceof ApiError ? e.message : 'Login failed',
      values: { email: String(formData.get('email') ?? '') },
    };
  }
  // redirect() works by throwing, so it must be OUTSIDE the try/catch
  const from = String(formData.get('from') || '/products');
  redirect(from.startsWith('/') ? from : '/products'); // only same-site paths
}

export async function register(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = {
    username: String(formData.get('username') ?? ''),
    email: String(formData.get('email') ?? ''),
    phoneNumber: String(formData.get('phoneNumber') ?? ''),
  };
  if (formData.get('password') !== formData.get('confirmPassword')) {
    return { error: 'Passwords do not match', values };
  }
  try {
    await apiFetch('/auth/register', {
      method: 'POST',
      body: { ...values, password: formData.get('password') },
    });
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : 'Registration failed', values };
  }
  redirect('/login?registered=1');
}

export async function logout(): Promise<void> {
  await deleteToken();
  redirect('/login');
}