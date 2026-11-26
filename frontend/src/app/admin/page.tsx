// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/admin/page.tsx — "/admin": the admin dashboard with counts.
// DATA COMES FROM: GET /products, GET /users, GET /orders (all at once).
// ─────────────────────────────────────────────────────────────────────────────

// Suspense = wait for data.
import { Suspense } from 'react';
// One number box.
import { StatCard } from '@/components/admin/stat-card';
// "Loading…" text.
import { Loading } from '@/components/ui/loading';
// The page's <h1>.
import { PageHeading } from '@/components/ui/page-heading';
// SEO helper.
import { buildMetadata } from '@/lib/seo';
// The three API calls.
import { getAllOrders } from '@/services/order.service';
import { getProducts } from '@/services/product.service';
import { getUsers } from '@/services/user.service';
// The list of all statuses (to count each one).
import { ORDER_STATUSES } from '@/types/order';

// SEO: private page -> noIndex.
export const metadata = buildMetadata({
  title: 'Admin dashboard',
  description: 'Store overview for admins.',
  path: '/admin',
  noIndex: true,
});

export default function AdminDashboardPage() {
  return (
    <section className="flex flex-col gap-6">
      <PageHeading title="Admin dashboard" subtitle="Store overview." />
      <Suspense fallback={<Loading />}>
        <Stats />
      </Suspense>
    </section>
  );
}

// Container: loads the three lists, counts them, shows the boxes.
async function Stats() {
  // Promise.all = run the 3 calls at the same time and wait for all of them.
  const [products, users, orders] = await Promise.all([getProducts(), getUsers(), getAllOrders()]);
  // How many orders have this status? (.filter keeps the matching ones; .length counts them)
  const countOf = (status: string) => orders.filter((order) => order.status === status).length;

  return (
    <div className="flex flex-col gap-6">
      {/* 3 boxes side by side from "sm" screens */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Products" value={products.length} />
        <StatCard label="Users" value={users.length} />
        <StatCard label="Orders" value={orders.length} />
      </div>
      <h2 className="text-xl font-semibold text-slate-900">Orders by status</h2>
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {/* One box per status */}
        {ORDER_STATUSES.map((status) => (
          <StatCard key={status} label={status} value={countOf(status)} />
        ))}
      </div>
    </div>
  );
}
