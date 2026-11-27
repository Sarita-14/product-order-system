// FILE: fail-payment.usecase.ts — Razorpay's popup reported "payment failed"
// @Injectable = Nest may create this class for us and hand it to any class that asks for it.
import { Injectable } from '@nestjs/common';
import { Order } from '../../orders/entities/order.entity';
import { OrderStatus } from '../../orders/enums/order-status.enum';
import { OrdersRepository } from '../../orders/repositories/orders.repository';
import { GetOrderUseCase } from '../../orders/usecases/get-order.usecase';

@Injectable()
export class FailPaymentUseCase {
  constructor(
    private readonly getOrderUseCase: GetOrderUseCase,
    private readonly ordersRepository: OrdersRepository,
  ) {}

  async execute(id: string, userId: string): Promise<Order> {
    await this.getOrderUseCase.execute(id, userId); // 404 if missing / not theirs
    await this.ordersRepository.changeStatus(id, [OrderStatus.PENDING], OrderStatus.FAILED);
    return this.getOrderUseCase.execute(id);
  }
}
