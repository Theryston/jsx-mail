import { Body, Controller, Post, Req } from '@nestjs/common';
import { EmailWebhookService } from './services/email-webhook.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailWebhookService: EmailWebhookService) {}

  @Post('webhook')
  async emailWebhook(@Body() data: any, @Req() req: Request) {
    const rawBody = await req.text();
    console.log('[EMAIL_WEBHOOK] raw body: ', rawBody);

    const result = await this.emailWebhookService.execute(data);
    console.log('[EMAIL_WEBHOOK] result: ', result);
    return result;
  }
}
