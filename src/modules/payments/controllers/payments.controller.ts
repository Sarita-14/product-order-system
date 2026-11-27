// ─────────────────────────────────────────────────────────────────────────────
// FILE: payments.controller.ts — the HTTP routes for paying an order (Razorpay).
// (What a controller is: see users.controller.ts.)
//
//   POST /orders/:id/payment          start: create the Razorpay order (Pay clicked)
//   POST /orders/:id/payment/verify   the popup said "paid": check it -> CONFIRMED
//   POST /orders/:id/payment/fail     the popup said "failed"         -> FAILED
//
// Every route needs a login (no @Public), and only the order's OWNER may use them.
// ─────────────────────────────────────────────────────────────────────────────

// Route decorators and request readers. HttpCode = choose the success status code.
import { Body, Controller, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post } from '@nestjs/common';
// Swagger decorators: they only describe the routes on the docs page.
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
// Shape of our error answers (docs).
import { ErrorResponseDto } from '../../../common/dto/error-response.dto';
// @CurrentUser(): the logged-in user from the token.
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
// The shape of the token content (type only).
import type { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
// The Order entity (docs).
import { Order } from '../../orders/entities/order.entity';
// Shapes of the answer / body.
import { PaymentSessionDto } from '../dto/payment-session.dto';
import { VerifyPaymentDto } from '../dto/verify-payment.dto';
// The service that does the work.
import { PaymentsService } from '../services/payments.service';

// Docs for the ":id" URL part, written once and reused below.
const ORDER_ID_PARAM = { name: 'id', description: 'Order id (UUID)', example: '72a7290d-222f-497e-8b06-51c10eabe5ee' };

@ApiTags('Payments') // group under "Payments" in the docs
@ApiBearerAuth() // every route here needs a token
@ApiParam(ORDER_ID_PARAM) // every route here has :id
@ApiUnauthorizedResponse({ description: 'Missing, invalid or expired token', type: ErrorResponseDto })
@ApiNotFoundResponse({ description: 'No such order, or it belongs to someone else', type: ErrorResponseDto })
@ApiInternalServerErrorResponse({ description: 'Unexpected server error', type: ErrorResponseDto })
@Controller('orders/:id/payment') // every route here starts with /orders/<id>/payment
export class PaymentsController {
  // Nest hands us the service ready to use.
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post() // POST /orders/<id>/payment
  @HttpCode(HttpStatus.OK) // 200, not 201: nothing of OURS is created, we only get popup details
  @ApiOperation({ summary: 'Start paying your unpaid order: returns what the Razorpay popup needs' })
  @ApiOkResponse({ description: 'Popup details; returned inside data', type: PaymentSessionDto })
  @ApiBadRequestResponse({ description: 'Invalid UUID, or the order is not PENDING/FAILED', type: ErrorResponseDto })
  @ApiServiceUnavailableResponse({ description: 'Razorpay keys are not configured', type: ErrorResponseDto })
  // id from the URL (400 if the format is wrong) + who is paying.
  start(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.paymentsService.start(id, user.sub);
  }

  @Post('verify') // POST /orders/<id>/payment/verify
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify the Razorpay signature; a valid one confirms the order' })
  @ApiOkResponse({ description: 'The CONFIRMED order; returned inside data', type: Order })
  @ApiBadRequestResponse({ description: 'Bad body, not payable, or invalid signature (order -> FAILED)', type: ErrorResponseDto })
  verify(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload, @Body() dto: VerifyPaymentDto) {
    return this.paymentsService.verify(id, user.sub, dto);
  }

  @Post('fail') // POST /orders/<id>/payment/fail
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Record a failed payment: a PENDING order becomes FAILED' })
  @ApiOkResponse({ description: 'The order as it is now; returned inside data', type: Order })
  @ApiBadRequestResponse({ description: 'id is not a valid UUID', type: ErrorResponseDto })
  fail(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.paymentsService.fail(id, user.sub);
  }
}
