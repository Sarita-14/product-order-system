import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';
import { CreateProductUseCase } from '../usecases/create-product.usecase';
import { DeleteProductUseCase } from '../usecases/delete-product.usecase';
import { GetProductUseCase } from '../usecases/get-product.usecase';
import { GetProductsUseCase } from '../usecases/get-products.usecase';
import { UpdateProductUseCase } from '../usecases/update-product.usecase';
@Injectable()
export class ProductsService {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  create(dto: CreateProductDto): Promise<Product> {
    return this.createProductUseCase.execute(dto);
  }

  findAll(search?: string): Promise<Product[]> {
    return this.getProductsUseCase.execute(search);
  }

  findOne(id: string): Promise<Product> {
    return this.getProductUseCase.execute(id);
  }

  update(id: string, dto: UpdateProductDto): Promise<Product> {
    return this.updateProductUseCase.execute(id, dto);
  }

  remove(id: string): Promise<void> {
    return this.deleteProductUseCase.execute(id);
  }
}