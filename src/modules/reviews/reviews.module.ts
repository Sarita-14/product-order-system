import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from '../orders/orders.module'; // -> OrdersRepository
import { ProductsModule } from '../products/products.module'; // -> ProductsRepository
import { UsersModule } from '../users/users.module'; // -> UsersService
import { ReviewsController } from './controllers/reviews.controller';
import { Review } from './entities/review.entity';
import { ReviewsRepository } from './repositories/reviews.repository';
import { ReviewsService } from './services/reviews.service';
import { CreateReviewUseCase } from './usecases/create-review.usecase';
import { GetProductReviewsUseCase } from './usecases/get-product-reviews.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), ProductsModule, OrdersModule, UsersModule],
  controllers: [ReviewsController], // receives the HTTP requests
  providers: [ReviewsService, ReviewsRepository, GetProductReviewsUseCase, CreateReviewUseCase],
})
export class ReviewsModule {}
