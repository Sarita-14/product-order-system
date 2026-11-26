'use client';
// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/ui/action-form.tsx
// The ONE form used for every create/update/delete/cancel in the app.
// Client Component only because useActionState needs the browser to show
// "Saving…" and the error without a page reload. The work itself runs
// on the server, in the Server Action passed as `action`.
//
// CONCEPT — 'use client' (line 1): this component also runs IN THE BROWSER
//   (needed for interactive things like "button shows Saving…").
//   Everything else in the app is a Server Component (runs only on the server).
//
// CONCEPT — useActionState: a React "hook" (a function starting with "use")
//   that connects a form to a Server Action and gives back:
//   state = the action's last answer (e.g. { error }), formAction = what the
//   <form> calls, pending = true while the action is running.
// ─────────────────────────────────────────────────────────────────────────────

// useActionState = the hook above. ReactNode = anything that can be shown.
import { useActionState, type ReactNode } from 'react';
// The type of a form action (type only, so no server code reaches the browser).
import type { FormAction } from '@/lib/form';
// The red error box.
import { Alert } from './alert';
// Button looks.
import { buttonClass, type ButtonVariant } from './styles';

// The inputs (props) this component accepts.
interface ActionFormProps {
  action: FormAction; // a Server Action, often bound to an id: cancelOrder.bind(null, id)
  submitLabel: string; // button text, e.g. "Place order"
  pendingLabel?: string; // button text while working, e.g. "Placing order…"
  variant?: ButtonVariant; // button look
  className?: string; // layout of the form
  children?: ReactNode; // the fields (built on the server and passed in)
}

export function ActionForm({
  action,
  submitLabel,
  pendingLabel = 'Saving…', // default when not given
  variant = 'primary', // default when not given
  className = 'flex flex-col gap-4', // default: fields stacked
  children,
}: ActionFormProps) {
  // Connect the form to the Server Action. "undefined" = no answer yet.
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    // On submit, the browser sends the fields to the Server Action.
    <form action={formAction} className={className}>
      {/* The action answered with an error -> show it in red */}
      {state?.error && <Alert>{state.error}</Alert>}
      {/* The fields given by the page */}
      {children}
      {/* Disabled while working, so it can't be clicked twice */}
      <button type="submit" disabled={pending} className={buttonClass[variant]}>
        {pending ? pendingLabel : submitLabel}
      </button>
    </form>
  );
}
