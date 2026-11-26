// ─────────────────────────────────────────────────────────────────────────────
// FILE: orders.service.ts — the middle layer between the controller and the use cases.
//
// CONCEPT — "service": the controller calls ONE service; the service picks
//   the right use case for each action. Keeps the controller thin.
// ─────────────────────────────────────────────────────────────────────────────

// @Injectable = Nest may create this class for us and hand it to any class that asks for it.
import { Injectable } from '@nestjs/common';
// "import type" = only used as a type (removed from the final JavaScript).
import type { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
// The list of roles.
import { Role } from '../../users/enums/role.enum';
// Body shape for placing an order.
import { CreateOrderDto } from '../dto/create-order.dto';
// The Order entity (return type).
import { Order } from '../entities/order.entity';
// The list of statuses.
import { OrderStatus } from '../enums/order-status.enum';
// The five use cases.
import { CancelOrderUseCase } from '../usecases/cancel-order.usecase';
import { GetOrderUseCase } from '../usecases/get-order.usecase';
import { GetOrdersUseCase } from '../usecases/get-orders.usecase';
import { PlaceOrderUseCase } from '../usecases/place-order.usecase';
import { UpdateOrderStatusUseCase } from '../usecases/update-order-status.usecase';

@Injectable()
export class OrdersService {
  // Nest hands us every use case ready to use (we never create them ourselves).
  constructor(
    private readonly placeOrderUseCase: PlaceOrderUseCase,
    private readonly getOrdersUseCase: GetOrdersUseCase,
    private readonly getOrderUseCase: GetOrderUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
  ) {}

  // Place an order for this user.
  create(userId: string, dto: CreateOrderDto): Promise<Order> {
    return this.placeOrderUseCase.execute(userId, dto);
  }

  // Every order (admin).
  findAll(): Promise<Order[]> {
    return this.getOrdersUseCase.execute();
  }

  // Only this user's orders.
  findMine(userId: string): Promise<Order[]> {
    return this.getOrdersUseCase.execute(userId);
  }

  // Admins may open any order; everyone else only their own.
  findOne(id: string, viewer: JwtPayload): Promise<Order> {
    // Admin -> no owner check (undefined); customer -> must be their own (their id).
    const ownerId = viewer.role === Role.Admin ? undefined : viewer.sub;
    return this.getOrderUseCase.execute(id, ownerId);
  }

  // The owner cancels their order.
  cancel(id: string, userId: string): Promise<Order> {
    return this.cancelOrderUseCase.execute(id, userId);
  }

  // The admin changes the status.
  updateStatus(id: string, status: OrderStatus): Promise<Order> {
    return this.updateOrderStatusUseCase.execute(id, status);
  }
}
