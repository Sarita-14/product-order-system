import { Injectable } from '@nestjs/common';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';
import { ProductsRepository } from '../repositories/products.repository';
import { GetProductUseCase } from './get-product.usecase';

/** Updates only the fields sent; 404 if the product doesn't exist or is deleted. */
@Injectable()
export class UpdateProductUseCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly getProductUseCase: GetProductUseCase,
  ) {}

  async execute(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.getProductUseCase.execute(id);
    return this.productsRepository.update(product, dto);
  }
}
