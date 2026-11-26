// ─────────────────────────────────────────────────────────────────────────────
// FILE: create-order.dto.ts — the rules for the JSON body of POST /orders.
//
// CONCEPT — "DTO" (Data Transfer Object): a class describing what the caller
//   must send. The @Is... decorators (from class-validator) are the rules.
//   Nest's ValidationPipe checks every request against them and answers 400
//   when something is wrong, BEFORE our code runs.
//
// Example body:  { "items": [ { "productId": "2648f9ad-...", "quantity": 2 } ] }
// ─────────────────────────────────────────────────────────────────────────────

// Type = tells the validator which class each array element is.
import { Type } from 'class-transformer';
// The validation rules used below.
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsInt,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
// The rules below come from the class-validator library.
// It checks the data the user sends BEFORE our code uses it.

// One line of the order: which product, how many.
export class OrderItemDto {
  /** @example "2648f9ad-2c33-422c-b14f-acf3b82fa308" */
  @IsUUID() // must be a real id (a long random code like 4f1c2b8d-...)
  productId: string;

  /** @example 2 */
  @IsInt() // must be a whole number
  @Min(1) // at least 1
  quantity: number;
}

// The customer is NOT in the body: it is taken from the token (@CurrentUser),
// so nobody can place an order in someone else's name.
export class CreateOrderDto {
  @IsArray() // must be a list
  @ArrayNotEmpty() // with at least one line
  // the same product may not appear twice (compare lines by productId)
  @ArrayUnique((item: OrderItemDto) => item.productId, {
    message: 'Each product can appear only once; combine quantities instead',
  })
  @ValidateNested({ each: true }) // check every line with OrderItemDto's rules too
  @Type(() => OrderItemDto) // each line is an OrderItemDto
  items: OrderItemDto[];
}
