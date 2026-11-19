import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './controllers/products.controller';
import { Product } from './entities/product.entity';
import { ProductsRepository } from './repositories/products.repository';
import { ProductsService } from './services/products.service';
import { CreateProductUseCase } from './usecases/create-product.usecase';
import { DeleteProductUseCase } from './usecases/delete-product.usecase';
import { GetProductUseCase } from './usecases/get-product.usecase';
import { GetProductsUseCase } from './usecases/get-products.usecase';
import { UpdateProductUseCase } from './usecases/update-product.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductsRepository,
    CreateProductUseCase,
    GetProductsUseCase,
    GetProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
  ],
  exports: [ProductsRepository], // PlaceOrderUseCase locks and updates stock through it
})
export class ProductsModule {}
