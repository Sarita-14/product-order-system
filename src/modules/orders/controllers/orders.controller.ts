// ─────────────────────────────────────────────────────────────────────────────
// FILE: orders.controller.ts — the HTTP routes under /api/v1/orders.
// (What a controller is: see users.controller.ts.)
//
//   POST  /orders              place an order (customers only)
//   GET   /orders              all orders (admin)
//   GET   /orders/my           my orders
//   GET   /orders/:id          one order (mine, or any for admin)
//   PATCH /orders/:id/cancel   cancel my order
//   PATCH /orders/:id/status   change the status (admin)
// ─────────────────────────────────────────────────────────────────────────────

// Route decorators and request readers (body, URL params).
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
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
// Shape of our error answers (docs).
import { ErrorResponseDto } from '../../../common/dto/error-response.dto';
// @CurrentUser(): the logged-in user from the token.
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
// @AdminOnly(): admins only. @CustomerOnly(): customers only.
import { AdminOnly, CustomerOnly } from '../../auth/decorators/roles.decorator';
// The shape of the token content (type only).
import type { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
// Body rules.
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
// The Order entity (docs).
import { Order } from '../entities/order.entity';
// The service that does the work.
import { OrdersService } from '../services/orders.service';

// Docs for the ":id" URL part, written once and reused below.
const ORDER_ID_PARAM = {
  name: 'id',
  description: 'Order id (UUID)',
  example: '72a7290d-222f-497e-8b06-51c10eabe5ee',
};

@ApiTags('Orders') // group under "Orders" in the docs
@ApiBearerAuth() // every route here needs a token
@ApiUnauthorizedResponse({ description: 'Missing, invalid or expired token', type: ErrorResponseDto })
@ApiInternalServerErrorResponse({ description: 'Unexpected server error', type: ErrorResponseDto })
@Controller('orders') // every route here starts with /orders
export class OrdersController {
  // Nest hands us the service ready to use (we never create them ourselves).
  constructor(private readonly ordersService: OrdersService) {}

  @Post() // POST /orders
  @CustomerOnly() // admins manage orders; they don't place them
  @ApiOperation({ summary: 'Place an order for the logged-in user: checks stock, deducts it and emails them' })
  @ApiCreatedResponse({ description: 'Order placed with status PENDING; returned inside data', type: Order })
  @ApiBadRequestResponse({
    description: 'Validation failed (empty items, product twice, quantity < 1) or insufficient stock',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Product not found (or deleted)', type: ErrorResponseDto })
  // user = who is logged in (from the token); dto = the checked JSON body.
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateOrderDto) {
    // user.sub = the user's id.
    return this.ordersService.create(user.sub, dto);
  }

  @Get() // GET /orders
  @AdminOnly() // admins only
  @ApiOperation({ summary: 'List ALL orders with their items, newest first (admin)' })
  @ApiOkResponse({ description: 'List of orders; returned inside data', type: [Order] })
  findAll() {
    return this.ordersService.findAll();
  }

  // Declared before ':id' so "my" is never treated as an id
  @Get('my') // GET /orders/my
  @ApiOperation({ summary: "The logged-in user's orders with items, newest first" })
  @ApiOkResponse({ description: 'List of orders; returned inside data', type: [Order] })
  findMine(@CurrentUser() user: JwtPayload) {
    return this.ordersService.findMine(user.sub);
  }

  @Get(':id') // GET /orders/<id>
  @ApiOperation({ summary: 'Get one order with its items (your own, or any if admin)' })
  @ApiParam(ORDER_ID_PARAM)
  @ApiOkResponse({ description: 'The order; returned inside data', type: Order })
  @ApiBadRequestResponse({ description: 'id is not a valid UUID', type: ErrorResponseDto })
  @ApiNotFoundResponse({ description: 'No such order, or it belongs to someone else', type: ErrorResponseDto })
  // id from the URL (400 if the id has the wrong format) + who is asking.
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.ordersService.findOne(id, user);
  }

  @Patch(':id/cancel') // PATCH /orders/<id>/cancel
  @ApiOperation({ summary: 'Cancel your own PENDING or FAILED order; its stock is restored' })
  @ApiParam(ORDER_ID_PARAM)
  @ApiOkResponse({ description: 'The cancelled order; returned inside data', type: Order })
  @ApiBadRequestResponse({ description: 'Invalid UUID, or the order can no longer be cancelled', type: ErrorResponseDto })
  @ApiNotFoundResponse({ description: 'No such order, or it belongs to someone else', type: ErrorResponseDto })
  cancel(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.ordersService.cancel(id, user.sub);
  }

  @Patch(':id/status') // PATCH /orders/<id>/status
  @AdminOnly() // admins only
  @ApiOperation({ summary: 'Move an order forward: CONFIRMED -> SHIPPED -> DELIVERED (admin)' })
  @ApiParam(ORDER_ID_PARAM)
  @ApiOkResponse({ description: 'The updated order; returned inside data', type: Order })
  @ApiBadRequestResponse({ description: 'Invalid UUID/status, or that move is not allowed', type: ErrorResponseDto })
  @ApiNotFoundResponse({ description: 'No order with this id', type: ErrorResponseDto })
  // id from the URL + { status } from the body.
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto.status);
  }
}
