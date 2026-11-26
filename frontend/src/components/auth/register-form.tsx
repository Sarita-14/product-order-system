'use client';
// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/auth/register-form.tsx — the sign-up form.
// Client Component for the same reason as login-form.tsx (useActionState).
// The account is created on the server, in the `register` Server Action.
// ─────────────────────────────────────────────────────────────────────────────

// Link to another page of our site.
import Link from 'next/link';
// useActionState = the React helper (a "hook") that connects the form to the Server Action.
import { useActionState } from 'react';
// The Server Action that creates the account.
import { register } from '@/actions/auth.actions';
// The red error box.
import { Alert } from '@/components/ui/alert';
// Shared styles.
import { buttonClass, inputClass, labelClass, linkClass } from '@/components/ui/styles';

export function RegisterForm() {
  // state = last answer; formAction = what the form calls; pending = working?
  const [state, formAction, pending] = useActionState(register, undefined);
  // What they typed last time (to refill the boxes after an error).
  const values = state?.values;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {/* e.g. "Email already exists" -> red message */}
      {state?.error && <Alert>{state.error}</Alert>}

      {/* Each input's "name" is what the action reads with formData.get(...) */}
      <label className={labelClass}>
        Username
        <input name="username" required autoComplete="username" defaultValue={values?.username} className={inputClass} />
      </label>

      <label className={labelClass}>
        Email
        <input name="email" type="email" required autoComplete="email" defaultValue={values?.email} className={inputClass} />
      </label>

      <label className={labelClass}>
        Phone number
        <input name="phoneNumber" type="tel" required autoComplete="tel" defaultValue={values?.phoneNumber} className={inputClass} />
      </label>

      {/* Passwords are never refilled (for safety) */}
      <label className={labelClass}>
        Password
        <input name="password" type="password" required minLength={6} autoComplete="new-password" className={inputClass} />
      </label>

      <label className={labelClass}>
        Confirm password
        <input name="confirmPassword" type="password" required minLength={6} autoComplete="new-password" className={inputClass} />
      </label>

      <button
        type="submit"
        disabled={pending} // can't click twice
        className={buttonClass.primary}
      >
        {pending ? 'Creating account…' : 'Register'}
      </button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link href="/login" className={linkClass}>
          Login
        </Link>
      </p>
    </form>
  );
}
