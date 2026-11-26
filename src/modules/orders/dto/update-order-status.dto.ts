// ─────────────────────────────────────────────────────────────────────────────
// FILE: update-order-status.dto.ts — body of PATCH /orders/:id/status (admin).
// Example body: { "status": "SHIPPED" }   (What a DTO is: see create-order.dto.ts.)
// ─────────────────────────────────────────────────────────────────────────────

// IsEnum = "the value must be one of the enum's values".
import { IsEnum } from 'class-validator';
// The list of statuses.
import { OrderStatus } from '../enums/order-status.enum';

/** Body of PATCH /orders/:id/status (admin). */
export class UpdateOrderStatusDto {
  /** @example "SHIPPED" */
  @IsEnum(OrderStatus) // anything else -> 400 before our code runs
  status: OrderStatus;
}
