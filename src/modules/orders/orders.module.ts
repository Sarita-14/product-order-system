// ─────────────────────────────────────────────────────────────────────────────
// FILE: orders.module.ts — puts all the order pieces together.
// (What a module is: see auth/auth.module.ts.)
// ─────────────────────────────────────────────────────────────────────────────

// Module = the decorator that makes a module.
import { Module } from '@nestjs/common';
// TypeOrmModule.forFeature = makes the database helpers for these tables available in this module.
import { TypeOrmModule } from '@nestjs/typeorm';
// Other modules we need (they export MailService, ProductsRepository, UsersService).
import { MailModule } from '../mail/mail.module';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
// Our own classes.
import { OrdersController } from './controllers/orders.controller';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrdersRepository } from './repositories/orders.repository';
import { OrdersService } from './services/orders.service';
import { CancelOrderUseCase } from './usecases/cancel-order.usecase';
import { GetOrderUseCase } from './usecases/get-order.usecase';
import { GetOrdersUseCase } from './usecases/get-orders.usecase';
import { PlaceOrderUseCase } from './usecases/place-order.usecase';
import { UpdateOrderStatusUseCase } from './usecases/update-order-status.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]), // the orders + order_items tables
    UsersModule, // -> UsersService
    ProductsModule, // -> ProductsRepository
    MailModule, // -> MailService
  ],
  // Receives the HTTP requests.
  controllers: [OrdersController],
  // Everything Nest must create for us and hand out.
  providers: [
    OrdersService,
    OrdersRepository,
    PlaceOrderUseCase,
    GetOrdersUseCase,
    GetOrderUseCase,
    CancelOrderUseCase,
    UpdateOrderStatusUseCase,
  ],
  // Shared with other modules: PaymentsModule loads orders (404 check) and changes their status;
  // CartModule turns a cart into an order with PlaceOrderUseCase.createOrder.
  exports: [OrdersRepository, GetOrderUseCase, PlaceOrderUseCase],
})
// Empty class; the settings above do the work.
export class OrdersModule {}
