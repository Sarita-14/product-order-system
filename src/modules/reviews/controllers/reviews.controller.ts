import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../../../common/dto/error-response.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Public } from '../../auth/decorators/public.decorator';
import { CustomerOnly } from '../../auth/decorators/roles.decorator';
import type { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { CreateReviewDto } from '../dto/create-review.dto';
import { ProductReviewsDto } from '../dto/product-reviews.dto';
import { Review } from '../entities/review.entity';
import { ReviewsService } from '../services/reviews.service';

@ApiTags('Reviews') 
@ApiParam({ name: 'productId', description: 'Product id (UUID)', example: '5c15faf1-90e9-4e91-951c-6a7501af9181' })
@ApiBadRequestResponse({ description: 'productId is not a valid UUID, or bad body', type: ErrorResponseDto })
@ApiNotFoundResponse({ description: 'No active product with this id', type: ErrorResponseDto })
@ApiInternalServerErrorResponse({ description: 'Unexpected server error', type: ErrorResponseDto })
@Controller('products/:productId/reviews') 
export class ReviewsController {

  constructor(private readonly reviewsService: ReviewsService) {}

  @Public() 
  @Get()
  @ApiOperation({ summary: "A product's reviews (newest first) with average rating and count" })
  @ApiOkResponse({ description: 'Returned inside data', type: ProductReviewsDto })
  findForProduct(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.reviewsService.findForProduct(productId);
  }

  @Post() 
  @CustomerOnly() 
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'Review a product you received (once per product)' })
  @ApiCreatedResponse({ description: 'The new review; returned inside data', type: Review })
  @ApiUnauthorizedResponse({ description: 'Missing, invalid or expired token', type: ErrorResponseDto })
  @ApiForbiddenResponse({ description: 'Admin, or product not delivered to you yet', type: ErrorResponseDto })
  @ApiConflictResponse({ description: 'You already reviewed this product', type: ErrorResponseDto })
  create(
    @CurrentUser() user: JwtPayload, 
    @Param('productId', ParseUUIDPipe) productId: string, 
    @Body() dto: CreateReviewDto, 
  ) {
    return this.reviewsService.create(user.sub, productId, dto);
  }
}
