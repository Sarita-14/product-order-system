// @Injectable = Nest may create this class for us and hand it to any class that asks for it.
import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from '../dto/create-review.dto';
import { ProductReviewsDto } from '../dto/product-reviews.dto';
import { Review } from '../entities/review.entity';
import { CreateReviewUseCase } from '../usecases/create-review.usecase';
import { GetProductReviewsUseCase } from '../usecases/get-product-reviews.usecase';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly getProductReviewsUseCase: GetProductReviewsUseCase,
    private readonly createReviewUseCase: CreateReviewUseCase,
  ) {}

  findForProduct(productId: string): Promise<ProductReviewsDto> {
    return this.getProductReviewsUseCase.execute(productId);
  }

  create(userId: string, productId: string, dto: CreateReviewDto): Promise<Review> {
    return this.createReviewUseCase.execute(userId, productId, dto);
  }
}
