'use client';
import Link from 'next/link';
import { useActionState } from 'react';
import { register } from '@/app/actions/auth';

export default function RegisterPage() {
  const [state, action, pending] = useActionState(register, undefined);

  return (
    <main style={{ maxWidth: 360, margin: '80px auto' }}>
      <h1>Create an account</h1>
      <form action={action} style={{ display: 'grid', gap: 12 }}>
        <input name="username" defaultValue={state?.values?.username} placeholder="Username" required />
        <input name="email" defaultValue={state?.values?.email} type="email" placeholder="Email" required />
        <input name="phoneNumber" defaultValue={state?.values?.phoneNumber} placeholder="Phone number" required />
        <input name="password" type="password" placeholder="Password" required minLength={6} />
        <input name="confirmPassword" type="password" placeholder="Confirm password" required />
        {state?.error && <p style={{ color: 'tomato' }}>{state.error}</p>}
        <button type="submit" disabled={pending}>{pending ? 'Creating…' : 'Register'}</button>
        <p>Already have an account? <Link href="/login">Log in</Link></p>
      </form>
    </main>
  );
}