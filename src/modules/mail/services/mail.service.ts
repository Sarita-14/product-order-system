import { Injectable } from '@nestjs/common';
import { Order } from '../../orders/entities/order.entity';
import { SendOrderConfirmationUseCase } from '../usecases/send-order-confirmation.usecase';

@Injectable()
export class MailService {
  constructor(
    private readonly sendOrderConfirmationUseCase: SendOrderConfirmationUseCase,
  ) {}
  sendOrderConfirmation(order: Order): Promise<void> {
    return this.sendOrderConfirmationUseCase.execute(order);
  }
}
