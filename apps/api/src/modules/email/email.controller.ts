import rawbody from 'raw-body';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { EmailWebhookService } from './services/email-webhook.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailWebhookService: EmailWebhookService) {}

  @Post('webhook')
  async emailWebhook(@Body() data: any, @Req() req) {
    const raw = await rawbody(req);
    const text = raw.toString().trim();

    console.log('[EMAIL_WEBHOOK] raw body: ', text);

    const result = await this.emailWebhookService.execute(data);
    console.log('[EMAIL_WEBHOOK] result: ', result);
    return result;
  }
}
