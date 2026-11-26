'use client';
import Link from 'next/link';
import { useActionState } from 'react';
import { login } from '@/app/actions/auth';

// useActionState runs the Server Action and gives back its result (state)
// plus `pending` while it is running.
export default function LoginForm({ from }: { from?: string }) {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} style={{ display: 'grid', gap: 12 }}>
      <input type="hidden" name="from" value={from ?? '/products'} />
      <input name="email" type="email" placeholder="Email" defaultValue={state?.values?.email} autoComplete="email" required />
      <input name="password" type="password" placeholder="Password" autoComplete="current-password" required minLength={6} />
      {state?.error && <p style={{ color: 'tomato' }}>{state.error}</p>}
      <button type="submit" disabled={pending}>{pending ? 'Logging in…' : 'Login'}</button>
      <p>New here? <Link href="/register">Create an account</Link></p>
    </form>
  );
}