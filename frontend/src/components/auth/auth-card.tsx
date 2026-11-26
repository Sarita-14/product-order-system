// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/auth/auth-card.tsx
// The centred white box around the login and register forms (written once, used twice).
// ─────────────────────────────────────────────────────────────────────────────

// ReactNode = anything that can be shown.
import type { ReactNode } from 'react';
// White box style.
import { cardClass } from '@/components/ui/styles';

// title = the <h1>; subtitle = line under it; children = the form.
export function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    // mx-auto = centred; max-w-md = not wider than a medium width.
    <section className={`mx-auto w-full max-w-md ${cardClass} p-8`}>
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-1 text-slate-600">{subtitle}</p>
      <div className="mt-6 flex flex-col gap-4">{children}</div>
    </section>
  );
}
