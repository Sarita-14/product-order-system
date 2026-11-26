import { Injectable } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { ProductsRepository } from '../repositories/products.repository';

@Injectable()
export class GetProductsUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  execute(search?: string): Promise<Product[]> {
    const term = search?.trim().slice(0, 100); // ignore spaces, cap the length
    return this.productsRepository.findAllActive(term || undefined);
  }
}