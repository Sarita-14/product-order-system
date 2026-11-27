// ─────────────────────────────────────────────────────────────────────────────
// FILE: lib/cache-tags.ts — the names ("tags") we stick on cached data.
//
// CONCEPT — cache tag: a label attached to cached data with cacheTag('...').
//   Later, updateTag('...') / revalidateTag('...') throws away everything carrying
//   that label, so the next visitor gets fresh data. Both sides must use the SAME
//   text, so the names are built ONLY here (never typed twice).
// ─────────────────────────────────────────────────────────────────────────────

// productReviewsTag('abc') -> 'product-reviews-abc' (one label per product,
// so a new review on product A doesn't throw away product B's cached reviews).
export const productReviewsTag = (productId: string) => `product-reviews-${productId}`;
