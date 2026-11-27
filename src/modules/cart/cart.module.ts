// ─────────────────────────────────────────────────────────────────────────────
// FILE: cart.module.ts — puts all the cart pieces together.
// (What a module is: see auth/auth.module.ts.)
// ─────────────────────────────────────────────────────────────────────────────

// Module = the decorator that makes a module.
import { Module } from '@nestjs/common';
// TypeOrmModule.forFeature = makes the cart_items table helper available here.
import { TypeOrmModule } from '@nestjs/typeorm';
// Other modules we reuse (they export these classes).
import { MailModule } from '../mail/mail.module'; // -> MailService
import { OrdersModule } from '../orders/orders.module'; // -> PlaceOrderUseCase
import { ProductsModule } from '../products/products.module'; // -> ProductsRepository
import { UsersModule } from '../users/users.module'; // -> UsersService
// Our own classes.
import { CartController } from './controllers/cart.controller';
import { CartItem } from './entities/cart-item.entity';
import { CartRepository } from './repositories/cart.repository';
import { CartService } from './services/cart.service';
import { ChangeCartUseCase } from './usecases/change-cart.usecase';
import { CheckoutCartUseCase } from './usecases/checkout-cart.usecase';
import { GetCartUseCase } from './usecases/get-cart.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem]), ProductsModule, OrdersModule, UsersModule, MailModule],
  controllers: [CartController], // receives the HTTP requests
  // Everything Nest must create for us and hand out.
  providers: [CartService, CartRepository, GetCartUseCase, ChangeCartUseCase, CheckoutCartUseCase],
})
// Empty class; the settings above do the work.
export class CartModule {}
