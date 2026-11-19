import { Module } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { SendOrderConfirmationUseCase } from './usecases/send-order-confirmation.usecase';

@Module({
  providers: [MailService, SendOrderConfirmationUseCase],
  exports: [MailService], // PlaceOrderUseCase sends the confirmation through it
})
export class MailModule {}
