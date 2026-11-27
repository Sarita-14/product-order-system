import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Review } from '../entities/review.entity';

export interface ReviewSummary {
  averageRating: number; // e.g. 4.3 (0 when there are no reviews yet)
  count: number; // how many reviews
}

@Injectable()
export class ReviewsRepository {
  constructor(
    @InjectRepository(Review)
    private readonly repo: Repository<Review>,
  ) {}

  findByProduct(productId: string): Promise<Review[]> {
    return this.repo.find({ where: { productId }, order: { createdAt: 'DESC' } });
  }

  existsFor(userId: string, productId: string): Promise<boolean> {
    return this.repo.existsBy({ userId, productId });
  }

  async summaryFor(productId: string): Promise<ReviewSummary> {
    const raw = await this.repo
      .createQueryBuilder('review')
      .select('COALESCE(AVG(review.rating), 0)', 'average') // AVG = average; COALESCE(..., 0) = 0 instead of null when empty
      .addSelect('COUNT(*)', 'count') // how many rows
      .where('review.product_id = :productId', { productId }) // :productId = safe placeholder (no SQL injection)
      .getRawOne<{ average: string; count: string }>(); // one row of plain values
    return {
      averageRating: Math.round(Number(raw?.average ?? 0) * 10) / 10,
      count: Number(raw?.count ?? 0),
    };
  }

  create(data: DeepPartial<Review>): Promise<Review> {
    return this.repo.save(this.repo.create(data));
  }
}
