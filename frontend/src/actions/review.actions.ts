'use server';
// ─────────────────────────────────────────────────────────────────────────────
// FILE: actions/review.actions.ts — "Submit review" on the product page.
// (Server Action concept: see lib/form.ts.)
//
// The real rules (bought + delivered, once per product) are checked by the BACKEND.
// Here we only: make sure a customer is sending it, read the form, call the API,
// and refresh the cached reviews (on-demand ISR) when it worked.
// ─────────────────────────────────────────────────────────────────────────────

// Visitors -> /login, admins -> /admin (the backend refuses them too).
import { requireCustomer } from '@/lib/auth';
// attempt = run an API call and turn its error into a form message; text = read a trimmed field.
import { attempt, text, type FormState } from '@/lib/form';
// Throw away this product's cached reviews (see lib/revalidate.ts).
import { refreshProductReviews } from '@/lib/revalidate';
// POST /products/<id>/reviews.
import { createReview as createReviewApi } from '@/services/review.service';
// The rules, to catch obvious mistakes before calling the API.
import { MAX_COMMENT_LENGTH, MAX_RATING, MIN_RATING } from '@/types/review';

// productId comes first because the form binds it: createReview.bind(null, product.id).
// _prev = the form's previous answer (not needed here; "_" = unused on purpose).
export async function createReview(productId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  // The check lives HERE on the server: hiding the form is not enough (anyone can send it).
  await requireCustomer();

  // Read the two fields. Number('4') -> 4; Number('') -> 0 (then refused below).
  const rating = Number(text(formData, 'rating'));
  const comment = text(formData, 'comment');

  // Quick checks (the backend checks the same again).
  if (!Number.isInteger(rating) || rating < MIN_RATING || rating > MAX_RATING) {
    return { error: `Choose a rating from ${MIN_RATING} to ${MAX_RATING} stars` };
  }
  if (!comment || comment.length > MAX_COMMENT_LENGTH) {
    return { error: `Write a comment (up to ${MAX_COMMENT_LENGTH} characters)` };
  }

  // Send it. Errors come back as friendly text, e.g.
  // "You can review a product only after it has been delivered to you" (403)
  // "You have already reviewed this product" (409)
  const result = await attempt(() => createReviewApi(productId, { rating, comment }), 'Could not save your review');
  if (!result.ok) return result.state;

  // Worked -> the cached list is out of date: rebuild it now (on-demand ISR).
  refreshProductReviews(productId);
  return { success: 'Thank you! Your review has been posted.' };
}
