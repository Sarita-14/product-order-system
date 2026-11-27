// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/(customer)/checkout/page.tsx — "/checkout": review what you're buying, place the order.
// Shows ONLY the products in the cart ("Order now" adds its product to the cart first).
// Quantities are changed on the cart page. The stock was already reserved when the
// items went into the cart, so placing the order doesn't take it a second time.
// ─────────────────────────────────────────────────────────────────────────────

// Link to another page of our site.
import Link from 'next/link';
// Suspense = wait for data.
import { Suspense } from 'react';
// The Server Action that turns the cart into an order.
import { checkoutCart } from '@/actions/cart.actions';
// The table of chosen products (read-only here) + its total.
import { CartItems } from '@/components/cart/cart-items';
// The shared form (error box + submit button).
import { ActionForm } from '@/components/ui/action-form';
// "Loading…" text.
import { Loading } from '@/components/ui/loading';
// The page's <h1>.
import { PageHeading } from '@/components/ui/page-heading';
// Shared styles.
import { linkClass, mutedClass } from '@/components/ui/styles';
// Customers only (admins are sent to /admin).
import { requireCustomer } from '@/lib/auth';
// "/cart".
import { CART_PATH } from '@/lib/routes';
// SEO helper.
import { buildMetadata } from '@/lib/seo';
// GET /cart.
import { getCart } from '@/services/cart.service';

// SEO: private page -> noIndex.
export const metadata = buildMetadata({
  title: 'Checkout',
  description: 'Review your items and place your order.',
  path: '/checkout',
  noIndex: true,
});

export default function CheckoutPage() {
  return (
    <section className="flex flex-col gap-6">
      <PageHeading title="Checkout" subtitle="Check your items and the total, then place the order." />
      <Suspense fallback={<Loading />}>
        <Checkout />
      </Suspense>
    </section>
  );
}

// Container: loads my cart, then shows it read-only with "Place order".
async function Checkout() {
  await requireCustomer();
  const lines = await getCart();

  // Nothing to buy -> say so, with a way back to the products.
  if (lines.length === 0) {
    return (
      <p className={mutedClass}>
        Nothing to check out yet.{' '}
        <Link href="/" className={linkClass}>
          Browse products
        </Link>
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* On submit -> checkoutCart runs on the server -> redirects to the new order's page */}
      <ActionForm action={checkoutCart} submitLabel="Place order" pendingLabel="Placing order…">
        <CartItems lines={lines} editable={false} />
      </ActionForm>
      <Link href={CART_PATH} className={`w-fit ${linkClass}`}>
        ← Edit cart
      </Link>
    </div>
  );
}
