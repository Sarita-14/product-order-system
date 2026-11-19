import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
 
  @Get()
  getInfo() {
    return {
      name: 'Product & Order Management API',
      version: '1.0',
      status: 'running',
      docs: '/api/v1/docs',
      endpoints: {
        users: '/api/v1/users',
        products: '/api/v1/products',
        orders: '/api/v1/orders',
      },
    };
  }
}
