import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../repositories/products.repository';
import { GetProductUseCase } from './get-product.usecase';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly getProductUseCase: GetProductUseCase,
  ) {}

  async execute(id: string): Promise<void> {
    const product = await this.getProductUseCase.execute(id);
    await this.productsRepository.deactivate(product.id);
  }
}
