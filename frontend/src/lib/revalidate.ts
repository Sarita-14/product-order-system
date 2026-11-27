
// FILE: lib/revalidate.ts — "something changed: draw these pages fresh next time".
// Mark pages as needing fresh data.
// revalidatePath = refresh a whole page; updateTag = throw away cached data with one label (Server Actions only).
import { revalidatePath, updateTag } from 'next/cache';//built in next
// The label of one product's cached reviews (see services/review.service.ts).
import { productReviewsTag } from './cache-tags';
import { ADMIN_PATHS, orderPath } from './routes';

// A new review was written -> the ON-DEMAND half of ISR: throw away this product's cached
// reviews NOW, so the writer (and everyone after them) sees it on the very next render,
// instead of waiting for the hourly background rebuild (cacheLife in review.service.ts).
// updateTag (not revalidateTag) = the next request waits for fresh data, never shows the old list.
export function refreshProductReviews(productId: string) {
  updateTag(productReviewsTag(productId));
}

export function refreshShop() {
  revalidatePath('/', 'layout');
}

// id = the order that changed (its status).
export function refreshOrderPages(id: string) {
  revalidatePath('/dashboard'); // the customer's order list shows the new status
  revalidatePath(orderPath(id)); // the order page shows the new status
  revalidatePath(ADMIN_PATHS.orders); // the admin order table
  revalidatePath(ADMIN_PATHS.dashboard); // the admin "orders by status" counts
}
