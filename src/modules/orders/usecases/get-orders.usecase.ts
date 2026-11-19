import { Injectable } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { OrdersRepository } from '../repositories/orders.repository';

/** Lists all orders with their items, newest first. */
@Injectable()
export class GetOrdersUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  execute(): Promise<Order[]> {
    return this.ordersRepository.findAll();
  }
}
