// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/(customer)/checkout/page.tsx — "/checkout": choose quantities, place the order.
// "/checkout?productId=<id>" pre-selects the product clicked with "Order now".
// ─────────────────────────────────────────────────────────────────────────────

// Suspense = wait for data.
import { Suspense } from 'react';
// The Server Action that places the order.
import { placeOrder } from '@/actions/order.actions';
// The quantity table.
import { CheckoutItems } from '@/components/orders/checkout-items';
// The shared form (error box + submit button).
import { ActionForm } from '@/components/ui/action-form';
// "Loading…" text.
import { Loading } from '@/components/ui/loading';
// The page's <h1>.
import { PageHeading } from '@/components/ui/page-heading';
// Grey text style.
import { mutedClass } from '@/components/ui/styles';
// SEO helper.
import { buildMetadata } from '@/lib/seo';
// GET /products.
import { getProducts } from '@/services/product.service';

// SEO: private page -> noIndex.
export const metadata = buildMetadata({
  title: 'Checkout',
  description: 'Choose quantities and place your order.',
  path: '/checkout',
  noIndex: true,
});

// The "?productId=..." part of the URL (it arrives a moment later, so we wait for it with await).
type SearchParams = Promise<{ productId?: string }>;

export default function CheckoutPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <section className="flex flex-col gap-6">
      <PageHeading title="Checkout" subtitle="Set a quantity for each product you want, then place the order." />
      <Suspense fallback={<Loading />}>
        <Checkout searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

// Container: reads the URL + loads products, then shows the form.
async function Checkout({ searchParams }: { searchParams: SearchParams }) {
  // Promise.all = wait for BOTH at the same time (faster than one after the other).
  const [{ productId }, products] = await Promise.all([searchParams, getProducts()]);
  if (products.length === 0) return <p className={mutedClass}>No products available yet.</p>;

  return (
    // On submit -> placeOrder runs on the server -> redirects to the new order's page.
    <ActionForm action={placeOrder} submitLabel="Place order" pendingLabel="Placing order…">
      <CheckoutItems products={products} selectedId={productId} />
    </ActionForm>
  );
}
