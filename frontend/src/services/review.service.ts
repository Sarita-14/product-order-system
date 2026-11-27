// FILE: services/review.service.ts — all review API calls live here.
import { cacheLife, cacheTag } from 'next/cache';
import { http, publicHttp } from '@/lib/axios';
import { productReviewsTag } from '@/lib/cache-tags';
import type { ProductReviews, Review, ReviewInput } from '@/types/review';

const reviewsUrl = (productId: string) => `/products/${productId}/reviews`;

export async function getProductReviews(productId: string): Promise<ProductReviews> {
  'use cache'; // remember the answer (shared by all visitors) instead of calling the API every time
  cacheLife('hours'); // safety net: rebuilt in the background at most every hour
  cacheTag(productReviewsTag(productId)); // label it, so a new review can refresh it at once
  return publicHttp.get<ProductReviews>(reviewsUrl(productId));
}

export const createReview = (productId: string, input: ReviewInput) =>
  http.post<Review>(reviewsUrl(productId), input);
