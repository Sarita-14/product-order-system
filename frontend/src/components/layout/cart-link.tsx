// FILE: components/layout/cart-link.tsx — "Cart (3)" in the header, for customers.
// It loads the cart from the backend with the login cookie (request data), so it sits inside <Suspense>.

// Link to another page of our site.
import Link from 'next/link';
// GET /cart.
import { getCart } from '@/services/cart.service';
// Count the items.
import { countItems } from '@/types/cart';
// "/cart".
import { CART_PATH } from '@/lib/routes';

// className = the header's link style (passed in, so it's written once in the header).
export async function CartLink({ className }: { className: string }) {
  // Backend down -> just "Cart" without a number, instead of breaking the whole header.
  const count = countItems(await getCart().catch(() => []));
  return (
    <Link href={CART_PATH} className={className}>
      {/* 🛒 is decorative: aria-hidden = screen readers skip it */}
      <span aria-hidden="true">🛒</span> Cart{count > 0 && ` (${count})`}
    </Link>
  );
}
