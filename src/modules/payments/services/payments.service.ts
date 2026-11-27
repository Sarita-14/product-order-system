// FILE: payments.service.ts — the middle layer between the controller and the use cases.

import { Injectable } from '@nestjs/common';
import { Order } from '../../orders/entities/order.entity';
import { PaymentSessionDto } from '../dto/payment-session.dto';
import { VerifyPaymentDto } from '../dto/verify-payment.dto';
import { FailPaymentUseCase } from '../usecases/fail-payment.usecase';
import { StartPaymentUseCase } from '../usecases/start-payment.usecase';
import { VerifyPaymentUseCase } from '../usecases/verify-payment.usecase';

@Injectable()//Create this class 
export class PaymentsService {
  // Nest hands us every use case ready to use.
  constructor(
    private readonly startPaymentUseCase: StartPaymentUseCase,
    private readonly verifyPaymentUseCase: VerifyPaymentUseCase,
    private readonly failPaymentUseCase: FailPaymentUseCase,
  ) {}
  //These are the 3 buttons other parts of your app can press

  //Check if this payment is real and mark the order CONFIRMED," then returns the updated Order
  start(orderId: string, userId: string): Promise<PaymentSessionDto> {//Go set up this payment with Razorpay,
    return this.startPaymentUseCase.execute(orderId, userId);
  }

  // Popup said "paid" -> check the signature -> CONFIRMED.
  verify(orderId: string, userId: string, dto: VerifyPaymentDto): Promise<Order> {
    return this.verifyPaymentUseCase.execute(orderId, userId, dto);
  }
  

  // Popup said "failed" -> FAILED.
  fail(orderId: string, userId: string): Promise<Order> {
    return this.failPaymentUseCase.execute(orderId, userId);
  }
}
