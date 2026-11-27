// ─────────────────────────────────────────────────────────────────────────────
// FILE: cart.controller.ts — the HTTP routes under /api/v1/cart (customers only).
// (What a controller is: see users.controller.ts.)
//
//   GET   /cart                    my cart lines (with products)
//   POST  /cart/items              add ONE of a product          -> stock -1
//   PATCH /cart/items/:productId   set a quantity (0 = remove)    -> stock moves by the difference
//   POST  /cart/checkout           the whole cart -> one PENDING order (stock already reserved)
// ─────────────────────────────────────────────────────────────────────────────

// Route decorators and request readers.
import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
// Swagger decorators: they only describe the routes on the docs page.
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
// Shape of our error answers (docs).
import { ErrorResponseDto } from '../../../common/dto/error-response.dto';
// @CurrentUser(): the logged-in user from the token.
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
// @CustomerOnly(): admins get a 403 (they manage the shop; they don't shop).
import { CustomerOnly } from '../../auth/decorators/roles.decorator';
// The shape of the token content (type only).
import type { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
// The Order entity (docs).
import { Order } from '../../orders/entities/order.entity';
// Body shapes.
import { AddCartItemDto } from '../dto/add-cart-item.dto';
import { SetCartQuantityDto } from '../dto/set-cart-quantity.dto';
// The CartItem entity (docs).
import { CartItem } from '../entities/cart-item.entity';
// The service that does the work.
import { CartService } from '../services/cart.service';

@ApiTags('Cart') // group under "Cart" in the docs
@ApiBearerAuth() // every route here needs a token
@CustomerOnly() // ...a CUSTOMER token (on the whole controller = every route)
@ApiUnauthorizedResponse({ description: 'Missing, invalid or expired token', type: ErrorResponseDto })
@ApiInternalServerErrorResponse({ description: 'Unexpected server error', type: ErrorResponseDto })
@Controller('cart') // every route here starts with /cart
export class CartController {
  // Nest hands us the service ready to use.
  constructor(private readonly cartService: CartService) {}

  @Get() // GET /cart
  @ApiOperation({ summary: 'My cart (each line with its product)' })
  @ApiOkResponse({ description: 'Cart lines; returned inside data', type: [CartItem] })
  find(@CurrentUser() user: JwtPayload) {
    return this.cartService.find(user.sub);
  }

  @Post('items') // POST /cart/items
  @ApiOperation({ summary: 'Add one of a product to my cart (reserves it: stock -1)' })
  @ApiCreatedResponse({ description: 'The whole cart afterwards; returned inside data', type: [CartItem] })
  @ApiBadRequestResponse({ description: 'Bad body, or not enough stock', type: ErrorResponseDto })
  @ApiNotFoundResponse({ description: 'No active product with this id', type: ErrorResponseDto })
  add(@CurrentUser() user: JwtPayload, @Body() dto: AddCartItemDto) {
    return this.cartService.add(user.sub, dto.productId);
  }

  @Patch('items/:productId') // PATCH /cart/items/<productId>
  @ApiOperation({ summary: 'Set a quantity in my cart (0 removes it); the stock moves by the difference' })
  @ApiOkResponse({ description: 'The whole cart afterwards; returned inside data', type: [CartItem] })
  @ApiBadRequestResponse({ description: 'Bad id/body, or not enough stock', type: ErrorResponseDto })
  @ApiNotFoundResponse({ description: 'No active product with this id', type: ErrorResponseDto })
  set(
    @CurrentUser() user: JwtPayload,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() dto: SetCartQuantityDto,
  ) {
    return this.cartService.set(user.sub, productId, dto.quantity);
  }

  @Post('checkout') // POST /cart/checkout
  @ApiOperation({ summary: 'Place one order with everything in my cart, then empty it' })
  @ApiCreatedResponse({ description: 'The new PENDING order; returned inside data', type: Order })
  @ApiBadRequestResponse({ description: 'The cart is empty', type: ErrorResponseDto })
  checkout(@CurrentUser() user: JwtPayload) {
    return this.cartService.checkout(user.sub);
  }
}
