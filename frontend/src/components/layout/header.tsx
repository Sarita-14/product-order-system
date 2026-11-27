// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/layout/header.tsx — the bar at the top of every page.
// Used by app/layout.tsx (so it appears on all pages).
// ─────────────────────────────────────────────────────────────────────────────

// Link = link to another page of our site.
import Link from 'next/link';
// Suspense = show stand-in text (like "Loading…") while a part is still loading.
import { Suspense } from 'react';
// The right side: Login/Register, or the user's menu.
import { AuthButtons } from './auth-buttons';
// The header's link style.
import { navLinkClass } from '@/components/ui/styles';

export function Header() {
  return (
    // sticky top-0 = stays at the top while scrolling; z-10 = drawn above the page.
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      {/* Centre the content and put the logo left, the buttons right */}
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        {/* The logo: clicking it goes to the home page */}
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-sm text-white">
            PO
          </span>
          {/* hidden on small phones, shown from "sm" (small screens) upwards */}
          <span className="hidden sm:inline">Product Order System</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* For everyone: the product list */}
          <Link href="/" className={navLinkClass}>
            Products
          </Link>
          {/* The rest depends on who is logged in (Cart only for customers, Admin only for admins).
              AuthButtons reads the login cookie (request data) -> must be inside <Suspense> */}
          <Suspense fallback={null}>
            <AuthButtons />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
