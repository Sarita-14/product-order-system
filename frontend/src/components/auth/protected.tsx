// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/auth/protected.tsx
// Wraps a layout's pages in a login check (requireUser or requireAdmin).
// The check reads the cookie (request data), so it must sit inside <Suspense>.
// Used by: app/(customer)/layout.tsx and app/admin/layout.tsx.
// ─────────────────────────────────────────────────────────────────────────────

// Suspense = show stand-in text (like "Loading…") while waiting. ReactNode = anything that can be shown.
import { Suspense, type ReactNode } from 'react';
// The "Loading…" text.
import { Loading } from '@/components/ui/loading';

// check = the function to run (requireUser or requireAdmin); children = the pages.
export function Protected({ check, children }: { check: () => Promise<unknown>; children: ReactNode }) {
  return (
    <Suspense fallback={<Loading />}>
      <Gate check={check}>{children}</Gate>
    </Suspense>
  );
}

// "async" component = a Server Component that may wait for data.
async function Gate({ check, children }: { check: () => Promise<unknown>; children: ReactNode }) {
  await check(); // redirects to /login or shows 404 when not allowed
  // Allowed -> show the pages. <>...</> = a wrapper that adds no tag of its own.
  return <>{children}</>;
}
