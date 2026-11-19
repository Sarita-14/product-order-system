import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../entities/order.entity';
import { GetOrderUseCase } from '../usecases/get-order.usecase';
import { GetOrdersUseCase } from '../usecases/get-orders.usecase';
import { PlaceOrderUseCase } from '../usecases/place-order.usecase';
@Injectable()
export class OrdersService {
  constructor(
    private readonly placeOrderUseCase: PlaceOrderUseCase,
    private readonly getOrdersUseCase: GetOrdersUseCase,
    private readonly getOrderUseCase: GetOrderUseCase,
  ) {}

  create(dto: CreateOrderDto): Promise<Order> {
    return this.placeOrderUseCase.execute(dto);
  }

  findAll(): Promise<Order[]> {
    return this.getOrdersUseCase.execute();
  }

  findOne(id: string): Promise<Order> {
    return this.getOrderUseCase.execute(id);
  }
}
