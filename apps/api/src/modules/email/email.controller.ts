import { Body, Controller, Headers, Post } from '@nestjs/common';
import { EmailWebhookService } from './services/email-webhook.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailWebhookService: EmailWebhookService) {}

  @Post('webhook')
  async emailWebhook(@Body() data: any, @Headers() headers: any) {
    console.log('[EMAIL_WEBHOOK] headers: ', headers);

    const result = await this.emailWebhookService.execute(data);
    console.log('[EMAIL_WEBHOOK] result: ', result);
    return result;
  }
}
