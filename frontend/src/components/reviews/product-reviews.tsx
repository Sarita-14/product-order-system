import { Suspense } from 'react';
import { cardClass, mutedClass } from '@/components/ui/styles';
import { formatDate } from '@/lib/format';
// The section's id, so links like "/products/<id>#reviews" scroll straight here.
import { REVIEWS_SECTION_ID } from '@/lib/routes';
import { getProductReviews } from '@/services/review.service';
import { ReviewForm } from './review-form';
import { StarRating } from './star-rating';

export async function ProductReviews({ productId }: { productId: string }) {
  const { averageRating, count, reviews } = await getProductReviews(productId);

  return (
    // scroll-mt-24 = leave room for the sticky header when the page jumps here.
    <section id={REVIEWS_SECTION_ID} aria-labelledby="reviews-heading" className={`flex scroll-mt-24 flex-col gap-4 ${cardClass}`}>
      <h2 id="reviews-heading" className="text-xl font-semibold text-slate-900">
        Customer reviews
      </h2>

      {/* Summary: "★★★★☆ 4.3 · 12 reviews", or a note when there are none */}
      {count > 0 ? (
        <p className="flex items-center gap-2">
          <StarRating rating={averageRating} />
          <span className="font-medium text-slate-900">{averageRating.toFixed(1)}</span>
          {/* "1 review" / "12 reviews" */}
          <span className={mutedClass}>
            · {count} {count === 1 ? 'review' : 'reviews'}
          </span>
        </p>
      ) : (
        <p className={mutedClass}>No reviews yet.</p>
      )}

      {/* The list, newest first */}
      {reviews.length > 0 && (
        <ul className="flex flex-col divide-y divide-slate-100">
          {reviews.map((review) => (
            // key = React's id for each item of a list
            <li key={review.id} className="flex flex-col gap-1 py-3">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <StarRating rating={review.rating} />
                <span className="font-medium text-slate-900">{review.reviewerName}</span>
                {/* <time> = a date the browser/search engines can understand */}
                <time dateTime={review.createdAt} className={mutedClass}>
                  {formatDate(review.createdAt)}
                </time>
              </div>
              {/* whitespace-pre-line = keep the line breaks the customer typed */}
              <p className="whitespace-pre-line text-slate-700">{review.comment}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Depends on who is looking (cookie) -> its own Suspense; no stand-in text needed */}
      <Suspense fallback={null}>
        <ReviewForm productId={productId} />
      </Suspense>
    </section>
  );
}
