// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/layout/footer.tsx — the bar at the bottom of every page.
// ─────────────────────────────────────────────────────────────────────────────

// Link = link to another page of our site.
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      {/* Stacked on phones (flex-col), side by side from "sm" screens (sm:flex-row) */}
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© Product Order System. Secure payments by Razorpay.</p>
        <nav className="flex gap-4">
          <Link href="/" className="hover:text-slate-900">
            Products
          </Link>
        </nav>
      </div>
    </footer>
  );
}
