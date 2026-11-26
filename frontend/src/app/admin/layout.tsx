// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/admin/layout.tsx — wraps every page under /admin.
// (What a layout is: see app/layout.tsx.)
// ─────────────────────────────────────────────────────────────────────────────

// ReactNode = anything that can be shown.
import type { ReactNode } from 'react';
// The admin tab bar.
import { AdminNav } from '@/components/admin/admin-nav';
// The login-check wrapper.
import { Protected } from '@/components/auth/protected';
// "Must be an admin": visitors -> /login, customers -> 404.
import { requireAdmin } from '@/lib/auth';

// Every page under /admin: visitors -> /login, customers -> 404, admins -> nav + page.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Protected check={requireAdmin}>
      <div className="flex flex-col gap-6">
        <AdminNav />
        {/* the current admin page */}
        {children}
      </div>
    </Protected>
  );
}
