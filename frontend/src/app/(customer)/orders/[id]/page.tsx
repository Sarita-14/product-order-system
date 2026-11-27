// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/(customer)/orders/[id]/page.tsx — "/orders/<id>": one order's details.
// Shows items, totals, status; and, for the owner of an unpaid order, Pay (Razorpay) + Cancel.
// ([id] dynamic route and generateMetadata: see app/(public)/products/[id]/page.tsx.)
// ─────────────────────────────────────────────────────────────────────────────

// Type of the metadata object (the title/description info for Google).
import type { Metadata } from 'next';
// Suspense = wait for data.
import { Suspense } from 'react';
// The order body (status + items table).
import { OrderDetails } from '@/components/orders/order-details';
// The "Cancel order" button (gives the stock back).
import { CancelOrderButton } from '@/components/orders/cancel-order-button';
// The Razorpay Pay button.
import { PayButton } from '@/components/orders/pay-button';
// "Write a review" links for a delivered order.
import { ReviewLinks } from '@/components/reviews/review-links';
// The red message box (for a failed payment).
import { Alert } from '@/components/ui/alert';
// "Loading…" text.
import { Loading } from '@/components/ui/loading';
// The page's <h1>.
import { PageHeading } from '@/components/ui/page-heading';
// Who is logged in (or a redirect to /login).
import { requireUser } from '@/lib/auth';
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
// Which statuses can still be cancelled / paid.
import { CANCELLABLE_STATUSES, PAYABLE_STATUSES } from '@/types/order';

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
  // Both at the same time (Promise.all): the order, and who is looking at it.
  const [order, user] = await Promise.all([
    findOrNotFound(getOrderById(id)), // someone else's order -> 404 too (admins may see any)
    requireUser(), // already loaded by the layout; cache() makes this free
  ]);
  // Only the OWNER may pay or cancel (an admin looking at a customer's order gets no buttons).
  const isOwner = order.userId === user.id;
  // .includes = is the status in the list?
  const canPay = isOwner && PAYABLE_STATUSES.includes(order.status); // PENDING or FAILED
  const canCancel = isOwner && CANCELLABLE_STATUSES.includes(order.status);

  return (
    <section className="flex flex-col gap-6">
      <PageHeading title={`Order ${formatOrderNumber(order.id)}`} />
      <OrderDetails order={order} />
      {/* The last payment attempt failed -> say so (Pay below lets them try again) */}
      {isOwner && order.status === 'FAILED' && (
        <Alert tone="warning">Your last payment did not go through. You can try again or cancel the order.</Alert>
      )}
      {/* Unpaid orders of the owner get Pay and Cancel */}
      {(canPay || canCancel) && (
        <div className="flex flex-wrap items-start gap-3">
          {canPay && <PayButton orderId={order.id} amount={order.totalAmount} />}
          {canCancel && <CancelOrderButton order={order} />}
        </div>
      )}
      {/* Delivered -> the owner may review what they received (admins viewing it get nothing) */}
      {isOwner && <ReviewLinks order={order} />}
    </section>
  );
}
