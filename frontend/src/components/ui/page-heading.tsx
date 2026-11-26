// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/ui/page-heading.tsx
// The ONE <h1> of a page, with an optional line under it and optional buttons on the right.
// (SEO rule: exactly one <h1> per page — every page uses this component for it.)
// ─────────────────────────────────────────────────────────────────────────────

// ReactNode = "anything that can be shown": text, a tag, a component...
import type { ReactNode } from 'react';

export function PageHeading({
  title, // the big heading text
  subtitle, // optional smaller line under it
  children, // optional things shown on the right (e.g. buttons)
}: {
  title: string;
  subtitle?: ReactNode;
  children?: ReactNode;
}) {
  return (
    // flex = place children side by side; flex-wrap = go to a new line if too narrow.
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        {/* "a && b" in JSX = show b only when a has a value */}
        {subtitle && <p className="text-slate-600">{subtitle}</p>}
      </div>
      {children}
    </header>
  );
}
