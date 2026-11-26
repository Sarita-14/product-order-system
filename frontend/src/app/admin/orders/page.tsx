// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/admin/orders/page.tsx — "/admin/orders": every order + status form per row.
// ─────────────────────────────────────────────────────────────────────────────

// Suspense = wait for data.
import { Suspense } from 'react';
// The Server Action that changes the status.
import { updateOrderStatus } from '@/actions/admin-order.actions';
// The orders table (same one the customer dashboard uses).
import { OrdersTable } from '@/components/orders/orders-table';
// The shared form.
import { ActionForm } from '@/components/ui/action-form';
// "Loading…" text.
import { Loading } from '@/components/ui/loading';
// The page's <h1>.
import { PageHeading } from '@/components/ui/page-heading';
// Styles.
import { inputClass, mutedClass } from '@/components/ui/styles';
// SEO helper.
import { buildMetadata } from '@/lib/seo';
// GET /orders.
import { getAllOrders } from '@/services/order.service';
// The "next allowed status" table + the Order shape.
import { NEXT_ADMIN_STATUS, type Order } from '@/types/order';

// SEO: private page -> noIndex.
export const metadata = buildMetadata({
  title: 'Manage orders',
  description: 'All orders and their status.',
  path: '/admin/orders',
  noIndex: true,
});

export default function AdminOrdersPage() {
  return (
    <section className="flex flex-col gap-6">
      <PageHeading title="Orders" subtitle="Move paid orders forward: CONFIRMED → SHIPPED → DELIVERED." />
      <Suspense fallback={<Loading />}>
        <AllOrders />
      </Suspense>
    </section>
  );
}

// Container: loads every order and shows the table with the extra admin columns.
async function AllOrders() {
  const orders = await getAllOrders();
  if (orders.length === 0) return <p className={mutedClass}>No orders yet.</p>;
  // showCustomer = add the Customer column; renderAction = what to show in the Action column.
  return <OrdersTable orders={orders} showCustomer renderAction={statusForm} />;
}

// Per row: a <select> with the status the order may move to next (none = no form).
function statusForm(order: Order) {
  // e.g. CONFIRMED -> 'SHIPPED'; DELIVERED -> undefined (nothing comes after).
  const next = NEXT_ADMIN_STATUS[order.status];
  // No allowed move -> just a dash.
  if (!next) return <span className={mutedClass}>—</span>;
  return (
    <ActionForm
      action={updateOrderStatus.bind(null, order.id)} // the action knows which order
      submitLabel="Update"
      pendingLabel="…"
      variant="secondary"
      className="flex items-center gap-2" // select and button side by side
    >
      {/* name="status" -> the action reads formData.get('status') */}
      <select name="status" defaultValue={next} aria-label="New status" className={`${inputClass} h-11`}>
        <option value={next}>{next}</option>
      </select>
    </ActionForm>
  );
}
