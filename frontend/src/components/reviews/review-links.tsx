// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/reviews/review-links.tsx — "Write a review" links for a DELIVERED order.
// Used in the "My orders" Action column and on the order page (written once, used twice).
// Each link opens the product page scrolled to the review form ("/products/<id>#reviews").
// The backend still checks everything (delivered, once per product) when the form is sent.
// ─────────────────────────────────────────────────────────────────────────────

// Link to another page of our site.
import Link from 'next/link';
// Link style.
import { linkClass } from '@/components/ui/styles';
// Builds "/products/<id>#reviews".
import { productReviewsPath } from '@/lib/routes';
// The Order shape (type only).
import type { Order } from '@/types/order';

// Pick = only the fields we need, so any order-like object works.
export function ReviewLinks({ order }: { order: Pick<Order, 'status' | 'items'> }) {
  // Only received products can be reviewed -> nothing for other statuses.
  if (order.status !== 'DELIVERED') return null;

  // The same product can appear twice in one order -> keep each product once.
  // new Map(...) keyed by product id = later duplicates replace earlier ones; .values() = the products.
  const products = [...new Map(order.items.map((item) => [item.productId, item.product])).values()];

  return (
    <ul className="flex flex-col gap-1 text-sm">
      {products.map((product) => (
        // key = React's id for each item of a list
        <li key={product.id}>
          <Link href={productReviewsPath(product.id)} className={linkClass}>
            {/* One product -> "Write a review"; several -> name each one */}
            {products.length === 1 ? 'Write a review' : `Review ${product.name}`}
          </Link>
        </li>
      ))}
    </ul>
  );
}
