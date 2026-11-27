// FILE: types/review.ts — what a review looks like in the frontend.
// DATA COMES FROM: GET /products/:productId/reviews (backend, reviews module).
export const MIN_RATING = 1; // lowest number of stars
export const MAX_RATING = 5; // highest number of stars
export const MAX_COMMENT_LENGTH = 1000; // longest comment, in characters

// One review, exactly as the API sends it (matches the backend Review entity).
export interface Review {
  id: string; // the review's own id
  productId: string; // which product
  userId: string; // who wrote it
  reviewerName: string; // the name shown next to it
  rating: number; // 1..5 stars
  comment: string; // the text
  createdAt: string; // date as text, e.g. "2026-11-27T07:30:00.000Z"
  updatedAt: string; // last change, as text
}

// The whole answer of GET /products/:productId/reviews.
export interface ProductReviews {
  averageRating: number; // e.g. 4.3 (0 when there are none)
  count: number; // how many reviews
  reviews: Review[]; // newest first
}

// What the review form sends to POST /products/:productId/reviews.
// Pick = only these two fields of Review.
export type ReviewInput = Pick<Review, 'rating' | 'comment'>;
