// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/(customer)/cart/page.tsx — "/cart": what the customer has added.
// Customers only: visitors are sent to /login (proxy.ts + the layout), admins to /admin.
// The items are RESERVED for the customer (already taken from the stock);
// lowering a quantity or setting 0 gives them back. Checkout shows exactly these products.
// ─────────────────────────────────────────────────────────────────────────────

// Link to another page of our site.
import Link from 'next/link';
// Suspense = wait for data.
import { Suspense } from 'react';
// The Server Action that saves new quantities.
import { updateCart } from '@/actions/cart.actions';
// The cart table.
import { CartItems } from '@/components/cart/cart-items';
// The shared form.
import { ActionForm } from '@/components/ui/action-form';
// "Loading…" text.
import { Loading } from '@/components/ui/loading';
// The page's <h1>.
import { PageHeading } from '@/components/ui/page-heading';
// Shared styles.
import { buttonClass, linkClass, mutedClass } from '@/components/ui/styles';
// Customers only.
import { requireCustomer } from '@/lib/auth';
// "/checkout".
import { CHECKOUT_PATH } from '@/lib/routes';
// SEO helper.
import { buildMetadata } from '@/lib/seo';
// GET /cart.
import { getCart } from '@/services/cart.service';

// SEO: a cart is personal -> noIndex.
export const metadata = buildMetadata({
  title: 'Your cart',
  description: 'The products in your cart.',
  path: '/cart',
  noIndex: true,
});

export default function CartPage() {
  return (
    <section className="flex flex-col gap-6">
      <PageHeading title="Your cart" subtitle="Please change the quantity to update." />
      <Suspense fallback={<Loading />}>
        <Cart />
      </Suspense>
    </section>
  );
}

// Container: loads my cart from the backend and shows it.
async function Cart() {
  await requireCustomer();
  const lines = await getCart();

  // Nothing in the cart -> say so, with a way back to the products.
  if (lines.length === 0) {
    return (
      <p className={mutedClass}>
        Your cart is empty.{' '}
        <Link href="/" className={linkClass}>
          Browse products
        </Link>
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ActionForm action={updateCart} submitLabel="Update cart" pendingLabel="Updating…" variant="secondary">
        <CartItems lines={lines} />
      </ActionForm>
      {/* A link styled as a button */}
      <Link href={CHECKOUT_PATH} className={`w-fit ${buttonClass.primary}`}>
        Proceed to checkout
      </Link>
    </div>
  );
}
