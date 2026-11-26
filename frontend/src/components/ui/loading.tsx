// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/ui/loading.tsx — the "Loading…" text.
// The stand-in text that <Suspense> shows while the server is still fetching data.
// (Suspense concept: see app/(public)/page.tsx.)
// ─────────────────────────────────────────────────────────────────────────────

// Grey text style.
import { mutedClass } from './styles';

// No inputs (props): always the same text.
export function Loading() {
  return <p className={mutedClass}>Loading…</p>;
}
