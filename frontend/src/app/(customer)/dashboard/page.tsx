// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/(customer)/dashboard/page.tsx — "/dashboard": greeting + my orders.
// ─────────────────────────────────────────────────────────────────────────────

// Link to another page of our site.
import Link from 'next/link';
// Suspense = wait for data.
import { Suspense } from 'react';
// The orders table.
import { OrdersTable } from '@/components/orders/orders-table';
// "Loading…" text.
import { Loading } from '@/components/ui/loading';
// The page's <h1>.
import { PageHeading } from '@/components/ui/page-heading';
// Styles.
import { linkClass, mutedClass } from '@/components/ui/styles';
// Who is logged in.
import { requireUser } from '@/lib/auth';
// SEO helper.
import { buildMetadata } from '@/lib/seo';
// GET /orders/my.
import { getMyOrders } from '@/services/order.service';

// SEO: private page -> noIndex.
export const metadata = buildMetadata({
  title: 'My dashboard',
  description: 'Your orders and their status.',
  path: '/dashboard',
  noIndex: true,
});

// Two independent parts, each waiting for its own data.
export default function DashboardPage() {
  return (
    <section className="flex flex-col gap-6">
      <Suspense fallback={<Loading />}>
        <Greeting />
      </Suspense>
      <h2 className="text-xl font-semibold text-slate-900">My orders</h2>
      <Suspense fallback={<Loading />}>
        <MyOrders />
      </Suspense>
    </section>
  );
}

// Container: "Hi, <username>".
async function Greeting() {
  const user = await requireUser(); // already fetched by the layout -> cached, no extra call
  return <PageHeading title={`Hi, ${user.username}`} subtitle="Here are your orders, newest first." />;
}

// Container: loads my orders and shows them.
async function MyOrders() {
  const orders = await getMyOrders();
  // No orders yet -> a message with a link to the shop.
  if (orders.length === 0) {
    return (
      <p className={mutedClass}>
        No orders yet.{' '}
        <Link href="/" className={linkClass}>
          Browse products
        </Link>
      </p>
    );
  }
  return <OrdersTable orders={orders} />;
}
