import { Injectable } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { ProductsRepository } from '../repositories/products.repository';

@Injectable()
export class GetProductsUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  execute(): Promise<Product[]> {
    return this.productsRepository.findAllActive();
  }
}
