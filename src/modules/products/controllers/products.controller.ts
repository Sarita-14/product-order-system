import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../../../common/dto/error-response.dto';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';
import { ProductsService } from '../services/products.service';

const PRODUCT_ID_PARAM = {
  name: 'id',
  description: 'Product id (UUID)',
  example: '5c15faf1-90e9-4e91-951c-6a7501af9181',
};

@ApiTags('Products')
@ApiInternalServerErrorResponse({ description: 'Unexpected server error', type: ErrorResponseDto })
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a product' })
  @ApiCreatedResponse({ description: 'Product created; returned inside data', type: Product })
  @ApiBadRequestResponse({ description: 'Validation failed (e.g. negative price or stock)', type: ErrorResponseDto })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List active products, newest first' })
  @ApiOkResponse({ description: 'List of products; returned inside data', type: [Product] })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one active product by id' })
  @ApiParam(PRODUCT_ID_PARAM)
  @ApiOkResponse({ description: 'The product; returned inside data', type: Product })
  @ApiBadRequestResponse({ description: 'id is not a valid UUID', type: ErrorResponseDto })
  @ApiNotFoundResponse({ description: 'No active product with this id', type: ErrorResponseDto })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product (send only the fields to change)' })
  @ApiParam(PRODUCT_ID_PARAM)
  @ApiOkResponse({ description: 'The updated product; returned inside data', type: Product })
  @ApiBadRequestResponse({ description: 'Invalid UUID or validation failed', type: ErrorResponseDto })
  @ApiNotFoundResponse({ description: 'No active product with this id', type: ErrorResponseDto })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete a product (hidden, kept for order history)' })
  @ApiParam(PRODUCT_ID_PARAM)
  @ApiNoContentResponse({ description: 'Product deleted; no body' })
  @ApiBadRequestResponse({ description: 'id is not a valid UUID', type: ErrorResponseDto })
  @ApiNotFoundResponse({ description: 'No active product with this id', type: ErrorResponseDto })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}