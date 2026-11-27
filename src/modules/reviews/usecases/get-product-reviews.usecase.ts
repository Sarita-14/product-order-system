import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from '../../products/repositories/products.repository';
import { ProductReviewsDto } from '../dto/product-reviews.dto';
import { ReviewsRepository } from '../repositories/reviews.repository';

@Injectable()
export class GetProductReviewsUseCase {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async execute(productId: string): Promise<ProductReviewsDto> {
    const product = await this.productsRepository.findActiveById(productId);
    if (!product) throw new NotFoundException(`Product ${productId} not found`);

    const [summary, reviews] = await Promise.all([
      this.reviewsRepository.summaryFor(productId),
      this.reviewsRepository.findByProduct(productId),
    ]);
    return { ...summary, reviews };
  }
}
