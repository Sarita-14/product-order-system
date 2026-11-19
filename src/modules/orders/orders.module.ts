import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../mail/mail.module';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { OrdersController } from './controllers/orders.controller';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrdersRepository } from './repositories/orders.repository';
import { OrdersService } from './services/orders.service';
import { GetOrderUseCase } from './usecases/get-order.usecase';
import { GetOrdersUseCase } from './usecases/get-orders.usecase';
import { PlaceOrderUseCase } from './usecases/place-order.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    UsersModule,
    ProductsModule,
    MailModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrdersRepository,
    PlaceOrderUseCase,
    GetOrdersUseCase,
    GetOrderUseCase,
  ],
})
export class OrdersModule {}
