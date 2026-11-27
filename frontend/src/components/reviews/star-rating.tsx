// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/reviews/star-rating.tsx — shows a rating as stars: ★★★★☆
// Used for each review AND for the average at the top (written once).
// ─────────────────────────────────────────────────────────────────────────────

// The highest number of stars (5).
import { MAX_RATING } from '@/types/review';

// rating = how many stars to fill (the average 4.3 shows 4 filled stars).
export function StarRating({ rating }: { rating: number }) {
  // Math.round(4.3) = 4 filled; the rest of the 5 are empty.
  const filled = Math.round(rating);
  return (
    // aria-label = what screen readers say instead of reading "★★★★☆" symbol by symbol.
    <span aria-label={`${rating} out of ${MAX_RATING} stars`} className="text-amber-500">
      {/* "★".repeat(4) = "★★★★" */}
      {'★'.repeat(filled)}
      {/* the empty stars in light grey */}
      <span className="text-slate-300">{'★'.repeat(MAX_RATING - filled)}</span>
    </span>
  );
}
