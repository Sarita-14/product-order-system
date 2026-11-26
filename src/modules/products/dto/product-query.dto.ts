import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

/** Query string of GET /products. Every field is optional. */
export class ProductQueryDto {
  /** Only products whose name contains this text (case-insensitive) @example "mouse" */
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MaxLength(100)
  query?: string;

  /** Page number, starting at 1 @example 1 */
  @ApiPropertyOptional() // has a default, so Swagger must not mark it required
  @IsOptional()
  @Type(() => Number) // query strings arrive as text
  @IsInt()
  @Min(1)
  @Max(100_000)
  page: number = 1;

  /** Products per page; capped so nobody can ask for the whole table @example 10 */
  @ApiPropertyOptional() // has a default, so Swagger must not mark it required
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;
}
