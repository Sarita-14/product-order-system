// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/admin/users/page.tsx — "/admin/users": registered users table.
// ─────────────────────────────────────────────────────────────────────────────

// Suspense = wait for data.
import { Suspense } from 'react';
// The users table.
import { UsersTable } from '@/components/admin/users-table';
// "Loading…" text.
import { Loading } from '@/components/ui/loading';
// The page's <h1>.
import { PageHeading } from '@/components/ui/page-heading';
// Grey text style.
import { mutedClass } from '@/components/ui/styles';
// SEO helper.
import { buildMetadata } from '@/lib/seo';
// GET /users.
import { getUsers } from '@/services/user.service';
// Who is looking (to leave their own row without a button).
import { requireAdmin } from '@/lib/auth';

// SEO: private page -> noIndex.
export const metadata = buildMetadata({
  title: 'Users',
  description: 'Registered users.',
  path: '/admin/users',
  noIndex: true,
});

export default function AdminUsersPage() {
  return (
    <section className="flex flex-col gap-6">
      <PageHeading title="Users" subtitle="Everyone who has registered, newest first. Use the buttons to make someone an admin or a customer." />
      <Suspense fallback={<Loading />}>
        <AllUsers />
      </Suspense>
    </section>
  );
}

// Container: loads users and shows the table.
async function AllUsers() {
  // Both at once: the list, and the admin looking at it (cached: the layout already checked).
  const [users, me] = await Promise.all([getUsers(), requireAdmin()]);
  if (users.length === 0) return <p className={mutedClass}>No users yet.</p>;
  return <UsersTable users={users} currentUserId={me.id} />;
}
