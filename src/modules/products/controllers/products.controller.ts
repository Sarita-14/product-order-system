// ─────────────────────────────────────────────────────────────────────────────
// FILE: products.controller.ts — the HTTP routes under /api/v1/products.
// (What a controller is: see users.controller.ts.)
//
// Who may call what:
//   GET  /products, GET /products/:id    -> anyone (@Public)
//   POST, PATCH, DELETE                  -> admins only (@AdminOnly)
// ─────────────────────────────────────────────────────────────────────────────

// Nest decorators for routes and for reading the request:
// @Body = JSON body, @Param = URL piece, @Query = "?search=..." part, HttpCode = change the status code.
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
// Swagger decorators: they only describe the routes on the docs page.
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
// Shape of our error answers (docs).
import { ErrorResponseDto } from '../../../common/dto/error-response.dto';
// @Public(): no token needed.
import { Public } from '../../auth/decorators/public.decorator';
// @AdminOnly(): admin token needed.
import { AdminOnly } from '../../auth/decorators/roles.decorator';
// Rules for the JSON body when creating / updating.
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
// The Product entity (response type in the docs).
import { Product } from '../entities/product.entity';
// The service that does the work.
import { ProductsService } from '../services/products.service';

// Docs for the ":id" URL part, written once and reused by 3 routes below.
const PRODUCT_ID_PARAM = {
  name: 'id',
  description: 'Product id (UUID)',
  example: '5c15faf1-90e9-4e91-951c-6a7501af9181',
};

@ApiTags('Products') // group under "Products" in the docs
@ApiBearerAuth() // create/update/delete need an ADMIN token; the two GETs are @Public
@ApiUnauthorizedResponse({ description: 'Missing, invalid or expired token', type: ErrorResponseDto })
@ApiInternalServerErrorResponse({ description: 'Unexpected server error', type: ErrorResponseDto })
@Controller('products') // every route here starts with /products
export class ProductsController {
  // Nest hands us the service ready to use (we never create it ourselves).
  constructor(private readonly productsService: ProductsService) {}

  @Post() // POST /products
  @AdminOnly() // admins only (403 for customers)
  @ApiOperation({ summary: 'Create a product' })
  @ApiCreatedResponse({ description: 'Product created; returned inside data', type: Product })
  @ApiBadRequestResponse({ description: 'Validation failed (e.g. negative price or stock)', type: ErrorResponseDto })
  // dto = the JSON body, already checked against CreateProductDto's rules.
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Public() // anyone, no token
  @Get() // GET /products
  @ApiOperation({ summary: 'List active products, newest first (optionally filtered by search)' })
  @ApiQuery({ name: 'search', required: false, description: 'Case-insensitive match on name or description', example: 'pen' })
  @ApiOkResponse({ description: 'List of products; returned inside data', type: [Product] })
  // @Query('search') = read ?search=... from the URL ("?" = it may be missing).
  findAll(@Query('search') search?: string) {
    return this.productsService.findAll(search);
  }

  @Public() // anyone, no token
  @Get(':id') // GET /products/<id>
  @ApiOperation({ summary: 'Get one active product by id' })
  @ApiParam(PRODUCT_ID_PARAM)
  @ApiOkResponse({ description: 'The product; returned inside data', type: Product })
  @ApiBadRequestResponse({ description: 'id is not a valid UUID', type: ErrorResponseDto })
  @ApiNotFoundResponse({ description: 'No active product with this id', type: ErrorResponseDto })
  // id from the URL; ParseUUIDPipe answers 400 if the id doesn't have the right format.
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id') // PATCH /products/<id>  (change some fields)
  @AdminOnly() // admins only
  @ApiOperation({ summary: 'Update a product (send only the fields to change)' })
  @ApiParam(PRODUCT_ID_PARAM)
  @ApiOkResponse({ description: 'The updated product; returned inside data', type: Product })
  @ApiBadRequestResponse({ description: 'Invalid UUID or validation failed', type: ErrorResponseDto })
  @ApiNotFoundResponse({ description: 'No active product with this id', type: ErrorResponseDto })
  // id from the URL + the fields to change from the body.
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id') // DELETE /products/<id>
  @AdminOnly() // admins only
  @HttpCode(HttpStatus.NO_CONTENT) // answer 204 "done, nothing to send back"
  @ApiOperation({ summary: 'Soft-delete a product (hidden, kept for order history)' })
  @ApiParam(PRODUCT_ID_PARAM)
  @ApiNoContentResponse({ description: 'Product deleted; no body' })
  @ApiBadRequestResponse({ description: 'id is not a valid UUID', type: ErrorResponseDto })
  @ApiNotFoundResponse({ description: 'No active product with this id', type: ErrorResponseDto })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
