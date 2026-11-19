import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { ProductsRepository } from '../repositories/products.repository';

@Injectable()
export class GetProductUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(id: string): Promise<Product> {
    const product = await this.productsRepository.findActiveById(id);
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }
}
