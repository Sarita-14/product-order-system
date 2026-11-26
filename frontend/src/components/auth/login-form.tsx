'use client';
// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/auth/login-form.tsx — the email + password form.
// Client Component only because useActionState needs the browser
// (to show "Logging in…" and the error without reloading the page).
// The login itself runs on the server, in the `login` Server Action.
// ('use client' and useActionState: see components/ui/action-form.tsx.)
// ─────────────────────────────────────────────────────────────────────────────

// Link = a link to another page of our site (fast, no full reload).
import Link from 'next/link';
// useActionState = the React helper (a "hook") that connects the form to the Server Action.
import { useActionState } from 'react';
// The Server Action that logs in.
import { login } from '@/actions/auth.actions';
// The red error box.
import { Alert } from '@/components/ui/alert';
// Shared styles.
import { buttonClass, inputClass, labelClass, linkClass } from '@/components/ui/styles';

// from = the page to return to after login (comes from /login?from=...).
export function LoginForm({ from }: { from?: string }) {
  // state = last answer of `login`; formAction = what the form calls; pending = working?
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {/* A hidden field so the action knows where to go after login */}
      {from && <input type="hidden" name="from" value={from} />}
      {/* Wrong password etc. -> red message */}
      {state?.error && <Alert>{state.error}</Alert>}

      <label className={labelClass}>
        Email
        <input
          name="email" // the action reads formData.get('email')
          type="email" // the browser checks it looks like an email
          required // can't be empty
          autoComplete="email" // lets the browser fill it in
          defaultValue={state?.values?.email} // after an error, keep what they typed
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Password
        <input
          name="password"
          type="password" // shows dots instead of letters
          required
          minLength={6} // at least 6 characters
          autoComplete="current-password"
          className={inputClass}
        />
      </label>

      <button
        type="submit" // clicking it submits the form
        disabled={pending} // can't click twice while logging in
        className={buttonClass.primary}
      >
        {pending ? 'Logging in…' : 'Login'}
      </button>

      <p className="text-center text-sm text-slate-600">
        New here?{' '}
        <Link href="/register" className={linkClass}>
          Create an account
        </Link>
      </p>
    </form>
  );
}
