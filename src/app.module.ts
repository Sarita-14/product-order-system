import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { MailModule } from './modules/mail/mail.module';
import { AuthModule } from './modules/auth/auth.module';
// Razorpay payments for orders.
import { PaymentsModule } from './modules/payments/payments.module';
// The customer's cart (reserves stock).
import { CartModule } from './modules/cart/cart.module';
// Product reviews (customers who received a product rate it 1-5 stars).
import { ReviewsModule } from './modules/reviews/reviews.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    CommonModule,
    DatabaseModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    MailModule,
    AuthModule,
    PaymentsModule,
    CartModule,
    ReviewsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}