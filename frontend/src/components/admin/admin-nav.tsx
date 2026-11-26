// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/admin/admin-nav.tsx
// The tab bar shown on every admin page (added once, by app/admin/layout.tsx).
// ─────────────────────────────────────────────────────────────────────────────

// Link to another page of our site.
import Link from 'next/link';
// The admin URLs.
import { ADMIN_PATHS } from '@/lib/routes';

// The four tabs: where they go + their text.
const links = [
  { href: ADMIN_PATHS.dashboard, label: 'Dashboard' },
  { href: ADMIN_PATHS.products, label: 'Products' },
  { href: ADMIN_PATHS.orders, label: 'Orders' },
  { href: ADMIN_PATHS.users, label: 'Users' },
];

export function AdminNav() {
  return (
    // aria-label = a name for screen readers ("Admin navigation").
    <nav aria-label="Admin" className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-2">
      {/* One link per tab */}
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
