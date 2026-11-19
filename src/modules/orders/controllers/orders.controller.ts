import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../../../common/dto/error-response.dto';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../entities/order.entity';
import { OrdersService } from '../services/orders.service';

@ApiTags('Orders')
@ApiInternalServerErrorResponse({ description: 'Unexpected server error', type: ErrorResponseDto })
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Place an order: checks stock, deducts it and emails the customer' })
  @ApiCreatedResponse({ description: 'Order placed with status CONFIRMED; returned inside data', type: Order })
  @ApiBadRequestResponse({
    description: 'Validation failed (empty items, product twice, quantity < 1) or insufficient stock',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({ description: 'User or product not found (or product deleted)', type: ErrorResponseDto })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all orders with their items, newest first' })
  @ApiOkResponse({ description: 'List of orders; returned inside data', type: [Order] })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one order with its items' })
  @ApiParam({ name: 'id', description: 'Order id (UUID)', example: '72a7290d-222f-497e-8b06-51c10eabe5ee' })
  @ApiOkResponse({ description: 'The order; returned inside data', type: Order })
  @ApiBadRequestResponse({ description: 'id is not a valid UUID', type: ErrorResponseDto })
  @ApiNotFoundResponse({ description: 'No order with this id', type: ErrorResponseDto })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }
}