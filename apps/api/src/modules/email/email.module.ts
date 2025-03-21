import { Module, forwardRef } from '@nestjs/common';
import { SendEmailService } from './services/send-email.service';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './email.processor';
import { PrismaService } from 'src/services/prisma.service';
import { EmailController } from './email.controller';
import { EmailWebhookService } from './services/email-webhook.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  providers: [
    PrismaService,
    SendEmailService,
    EmailProcessor,
    EmailWebhookService,
  ],
  exports: [SendEmailService],
  controllers: [EmailController],
})
export class EmailModule {}
