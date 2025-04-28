import { Body, Controller, Post } from '@nestjs/common';
import { EmailWebhookService } from './services/email-webhook.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailWebhookService: EmailWebhookService) {}

  @Post('webhook')
  async emailWebhook(@Body() data: any) {
    const result = await this.emailWebhookService.execute(data);
    return result || 'OK';
  }
}
