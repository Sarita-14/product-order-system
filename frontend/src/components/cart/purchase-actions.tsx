// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/cart/purchase-actions.tsx — the "buy" area of a product,
// different for each kind of person (used on the product cards and the product page):
//   visitor  -> "Login or Register to buy" (no cart without an account)
//   customer -> ["Order now"] + "Add to cart" (both reserve one: the stock goes down by 1)
//   admin    -> "Edit product" (admins manage products; they don't buy them)
// DATA COMES FROM: the `product` prop + getCurrentUser() (cookie + GET /auth/me, cached per request).
// It reads the cookie, so every page using it already has it inside <Suspense>.
// ─────────────────────────────────────────────────────────────────────────────

// Link to another page of our site.
import Link from 'next/link';
// The Server Actions: add one to the cart / add one and go to checkout.
import { addToCart, buyNow } from '@/actions/cart.actions';
// The shared form (button + green/red message).
import { ActionForm } from '@/components/ui/action-form';
// Shared styles.
import { linkClass } from '@/components/ui/styles';
// Who is looking (or null for visitors).
import { getCurrentUser } from '@/lib/auth';
// URL helpers.
import { CART_PATH, editProductPath, loginPath, productPath } from '@/lib/routes';
// The Product shape (type only).
import type { Product } from '@/types/product';

// showOrderNow = also show "Order now" (the product page does; the small cards don't).
export async function PurchaseActions({ product, showOrderNow = false }: { product: Product; showOrderNow?: boolean }) {
  const user = await getCurrentUser();

  // Admin -> a shortcut to edit this product, never shopping buttons.
  if (user?.role === 'admin') {
    return (
      <Link href={editProductPath(product.id)} className={`w-fit ${linkClass}`}>
        Edit product
      </Link>
    );
  }

  // Out of stock -> nothing to buy (the stock badge already says "Out of stock").
  if (product.stockQuantity === 0) return null;

  // Visitor -> must log in (and comes back to this product afterwards) or register first.
  if (!user) {
    return (
      <p className="text-sm text-slate-600">
        <Link href={loginPath(productPath(product.id))} className={linkClass}>
          Login
        </Link>{' '}
        or{' '}
        <Link href="/register" className={linkClass}>
          Register
        </Link>{' '}
        to buy this product.
      </p>
    );
  }

  // Customer -> the shopping buttons, side by side.
  return (
    <div className="flex flex-wrap items-start gap-3">
      {/* Order now = add one to the cart, then straight to checkout */}
      {showOrderNow && (
        <ActionForm action={buyNow.bind(null, product.id)} submitLabel="Order now" pendingLabel="Adding…" />
      )}
      {/* .bind(null, product.id) = the action already knows WHICH product */}
      <ActionForm
        action={addToCart.bind(null, product.id)}
        submitLabel="Add to cart"
        pendingLabel="Adding…"
        variant="secondary"
        className="flex flex-col gap-2"
        // Shown under the green "Added to cart" message: a shortcut to the cart page.
        onSuccess={
          <Link href={CART_PATH} className={`w-fit text-sm ${linkClass}`}>
            View cart
          </Link>
        }
      />
    </div>
  );
}
