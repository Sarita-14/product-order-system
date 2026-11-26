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
      <PageHeading title="Users" subtitle="Everyone who has registered, newest first." />
      <Suspense fallback={<Loading />}>
        <AllUsers />
      </Suspense>
    </section>
  );
}

// Container: loads users and shows the table.
async function AllUsers() {
  const users = await getUsers();
  if (users.length === 0) return <p className={mutedClass}>No users yet.</p>;
  return <UsersTable users={users} />;
}
