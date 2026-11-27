// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/(customer)/layout.tsx — wraps /dashboard, /cart, /checkout and /orders/<id>.
// Logged-in only. The shopping pages (dashboard, cart, checkout) also call requireCustomer();
// /orders/<id> stays open to admins too, who open orders from their admin table.
// (Route group "(customer)" is not in the URL: see app/(public)/page.tsx.)
// ─────────────────────────────────────────────────────────────────────────────

// ReactNode = anything that can be shown.
import type { ReactNode } from 'react';
// The login-check wrapper.
import { Protected } from '@/components/auth/protected';
// "Must be logged in, else /login".
import { requireUser } from '@/lib/auth';

// Every page inside (customer)/ is for logged-in users only (else -> /login).
export default function CustomerLayout({ children }: { children: ReactNode }) {
  return <Protected check={requireUser}>{children}</Protected>;
}
