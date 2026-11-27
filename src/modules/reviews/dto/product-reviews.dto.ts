import { Review } from '../entities/review.entity';
import { ReviewSummary } from '../repositories/reviews.repository';
export class ProductReviewsDto implements ReviewSummary {
  averageRating: number;
  count: number;
  reviews: Review[];
}
