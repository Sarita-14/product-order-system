import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  /** @example "Wireless Mouse" */
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  /** @example "2.4 GHz ergonomic mouse" */
  @IsOptional()
  @IsString()
  description?: string;

  /** @example 499.99 */
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  /** @example 50 */
  @IsInt()
  @Min(0)
  stockQuantity: number;
}
