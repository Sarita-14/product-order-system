// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/(customer)/orders/[id]/page.tsx — "/orders/<id>": one order's details.
// Shows items, totals, status; and for unpaid orders the (disabled) Pay button + Cancel.
// ([id] dynamic route and generateMetadata: see app/(public)/products/[id]/page.tsx.)
// ─────────────────────────────────────────────────────────────────────────────

// Type of the metadata object (the title/description info for Google).
import type { Metadata } from 'next';
// Suspense = wait for data.
import { Suspense } from 'react';
// The Server Action that cancels.
import { cancelOrder } from '@/actions/order.actions';
// The order body (status + items table).
import { OrderDetails } from '@/components/orders/order-details';
// The disabled Pay placeholder.
import { PayButton } from '@/components/orders/pay-button';
// The shared form (used here for the Cancel button).
import { ActionForm } from '@/components/ui/action-form';
// "Loading…" text.
import { Loading } from '@/components/ui/loading';
// The page's <h1>.
import { PageHeading } from '@/components/ui/page-heading';
// "#72A7290D".
import { formatOrderNumber } from '@/lib/format';
// API "not found" -> 404 page.
import { findOrNotFound } from '@/lib/not-found';
// Builds "/orders/<id>".
import { orderPath } from '@/lib/routes';
// SEO helper.
import { buildMetadata } from '@/lib/seo';
// GET /orders/<id>.
import { getOrderById } from '@/services/order.service';
// Which statuses can still be cancelled.
import { CANCELLABLE_STATUSES } from '@/types/order';

// The [id] from the URL (it arrives a moment later, so we wait for it with await).
type Params = Promise<{ id: string }>;

// SEO with the order number in the title; private -> noIndex.
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  return buildMetadata({
    title: `Order ${formatOrderNumber(id)}`,
    description: 'Items, total and status of your order.',
    path: orderPath(id),
    noIndex: true,
  });
}

export default function OrderPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<Loading />}>
      <Order params={params} />
    </Suspense>
  );
}

// Container: loads the order and shows it.
async function Order({ params }: { params: Params }) {
  const { id } = await params;
  const order = await findOrNotFound(getOrderById(id)); // someone else's order -> 404 too
  // .includes = is the status in the list?
  const unpaid = CANCELLABLE_STATUSES.includes(order.status); // PENDING or FAILED

  return (
    <section className="flex flex-col gap-6">
      <PageHeading title={`Order ${formatOrderNumber(order.id)}`} />
      <OrderDetails order={order} />
      {/* Only unpaid orders get the Pay placeholder and the Cancel button */}
      {unpaid && (
        <div className="flex flex-wrap items-start gap-3">
          <PayButton amount={order.totalAmount} />
          {/* .bind(null, order.id) = the action already knows WHICH order to cancel */}
          <ActionForm
            action={cancelOrder.bind(null, order.id)}
            submitLabel="Cancel order"
            pendingLabel="Cancelling…"
            variant="secondary"
          />
        </div>
      )}
    </section>
  );
}
