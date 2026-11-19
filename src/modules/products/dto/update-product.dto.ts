import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

/** Same rules as create, but every field is optional. */
export class UpdateProductDto extends PartialType(CreateProductDto) {}
