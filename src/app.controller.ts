import { Controller, Get } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDto } from './common/dto/error-response.dto';
import { Public } from './modules/auth/decorators/public.decorator';

@ApiTags('App')
@ApiInternalServerErrorResponse({ description: 'Unexpected server error', type: ErrorResponseDto })
@Controller()
export class AppController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'Health check: shows the API is running and where to find things' })
  @ApiOkResponse({
    description: 'The application is running',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: {
          name: 'Product & Order Management API',
          version: '1.0',
          message: 'Application is running',
          docs: '/api/v1/docs',
          endpoints: { auth: '/api/v1/auth', users: '/api/v1/users', products: '/api/v1/products', orders: '/api/v1/orders' },
        },
        timestamp: '2026-11-19T10:00:00.000Z',
      },
    },
  })
  getInfo() {
    return {
      name: 'Product & Order Management API',
      version: '1.0',
      message: 'Application is running',
      docs: '/api/v1/docs',
      endpoints: {
        auth: '/api/v1/auth',
        users: '/api/v1/users',
        products: '/api/v1/products',
        orders: '/api/v1/orders',
      },
    };
  }
}