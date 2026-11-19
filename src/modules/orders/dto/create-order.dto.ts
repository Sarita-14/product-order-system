import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsInt,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
//we have class validator
//jo user se data aayega it will validate
export class OrderItemDto {
  /** @example "2648f9ad-2c33-422c-b14f-acf3b82fa308" */
  @IsUUID()
  productId: string;

  /** @example 2 */
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsUUID()
  userId: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique((item: OrderItemDto) => item.productId, {
    message: 'Each product can appear only once; combine quantities instead',
  })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
