// ─────────────────────────────────────────────────────────────────────────────
// FILE: razorpay-webhook.controller.ts — POST /api/v1/payments/razorpay/webhook
// The URL you give Razorpay (dashboard: Settings -> Webhooks). Razorpay calls it
// by itself, so there is no login token: @Public. Instead, the request proves it
// comes from Razorpay with the X-Razorpay-Signature header (checked below).
// ─────────────────────────────────────────────────────────────────────────────

// Route decorators. RawBodyRequest = a request that also has .rawBody (enabled in main.ts).
// UnauthorizedException = a 401 error.
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  type RawBodyRequest,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
// Swagger decorators: they only describe the route on the docs page.
import { ApiHeader, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
// The Express request type.
import type { Request } from 'express';
// Shape of our error answers (docs).
import { ErrorResponseDto } from '../../../common/dto/error-response.dto';
// @Public(): no token needed.
import { Public } from '../../auth/decorators/public.decorator';
// Checks the signature.
import { RazorpayGateway } from '../gateways/razorpay.gateway';
// The body's shape.
import type { RazorpayWebhookEvent } from '../interfaces/razorpay-webhook-event.interface';
// Does the work.
import { HandleRazorpayWebhookUseCase } from '../usecases/handle-razorpay-webhook.usecase';

@ApiTags('Payments')
@Controller('payments/razorpay/webhook') // POST /payments/razorpay/webhook
export class RazorpayWebhookController {
  // Nest hands us the helpers ready to use.
  constructor(
    private readonly razorpay: RazorpayGateway,
    private readonly handleWebhook: HandleRazorpayWebhookUseCase,
  ) {}

  @Public() // Razorpay has no login token; the signature protects this route instead
  @Post()
  @HttpCode(HttpStatus.OK) // Razorpay only needs "200 = received"; anything else makes it retry
  @ApiOperation({ summary: 'Razorpay webhook: confirms or fails orders (called by Razorpay, not by the app)' })
  @ApiHeader({ name: 'X-Razorpay-Signature', description: 'HMAC-SHA256 of the raw body with the webhook secret' })
  @ApiOkResponse({ description: 'Event received' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid signature', type: ErrorResponseDto })
  async receive(
    @Req() req: RawBodyRequest<Request>, // for req.rawBody (the exact bytes Razorpay signed)
    @Headers('x-razorpay-signature') signature: string | undefined, // the proof
    @Body() event: RazorpayWebhookEvent, // the same body, already turned into an object
  ) {
    // No body bytes or no signature, or a wrong signature -> 401 (and nothing changes).
    if (!req.rawBody || !signature || !this.razorpay.isWebhookSignatureValid(req.rawBody, signature)) {
      throw new UnauthorizedException('Invalid webhook signature');
    }
    await this.handleWebhook.execute(event);
    return { received: true };
  }
}
