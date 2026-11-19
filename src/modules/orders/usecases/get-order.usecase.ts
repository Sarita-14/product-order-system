import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { OrdersRepository } from '../repositories/orders.repository';

/** Gets one order with its items, or throws 404. */
@Injectable()
export class GetOrderUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute(id: string): Promise<Order> {
    const order = await this.ordersRepository.findById(id);
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }
}
