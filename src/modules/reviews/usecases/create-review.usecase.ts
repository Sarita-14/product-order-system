import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from '../../orders/repositories/orders.repository';
import { ProductsRepository } from '../../products/repositories/products.repository';
import { UsersService } from '../../users/services/users.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { Review } from '../entities/review.entity';
import { ReviewsRepository } from '../repositories/reviews.repository';

@Injectable()
export class CreateReviewUseCase {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly ordersRepository: OrdersRepository,
    private readonly usersService: UsersService,
  ) {}

  async execute(userId: string, productId: string, dto: CreateReviewDto): Promise<Review> {
    const product = await this.productsRepository.findActiveById(productId);
    if (!product) throw new NotFoundException(`Product ${productId} not found`);

    const [delivered, alreadyReviewed] = await Promise.all([
      this.ordersRepository.hasDeliveredProduct(userId, productId),
      this.reviewsRepository.existsFor(userId, productId),
    ]);
    if (!delivered) throw new ForbiddenException('You can review a product only after it has been delivered to you');
    if (alreadyReviewed) throw new ConflictException('You have already reviewed this product');

    const user = await this.usersService.findOne(userId);

    return this.reviewsRepository.create({
      productId,
      userId,
      reviewerName: user.username, 
      rating: dto.rating,
      comment: dto.comment,
    });
  }
}
