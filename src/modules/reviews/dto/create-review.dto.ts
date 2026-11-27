// FILE: create-review.dto.ts — body of POST /products/:productId/reviews.
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Max, MaxLength, Min } from 'class-validator';

export const MIN_RATING = 1; // lowest number of stars
export const MAX_RATING = 5; // highest number of stars
export const MAX_COMMENT_LENGTH = 1000; // longest comment, in characters

export class CreateReviewDto {
  @IsInt() // 4.5 or "5" -> 400
  @Min(MIN_RATING) // 0 -> 400
  @Max(MAX_RATING) // 6 -> 400
  rating: number;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString() // must be text
  @IsNotEmpty() // "" or "   " (empty after trimming) -> 400
  @MaxLength(MAX_COMMENT_LENGTH) // too long -> 400
  comment: string;
}
