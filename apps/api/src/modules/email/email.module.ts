import { Module, forwardRef } from '@nestjs/common';
import { SendEmailService } from './services/send-email.service';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './email.processor';
import { PrismaService } from 'src/services/prisma.service';
import { EmailController } from './email.controller';
import { EmailWebhookService } from './services/email-webhook.service';
import { UserModule } from '../user/user.module';
import { CheckUserEmailStatsService } from './services/check-user-email-stats.service';
import { UpdateMessageStatusService } from './services/update-message-status.service';
import { ResetQueueRateLimitService } from './services/reset-queue-rate-limit.service';
import { MarkBounceToService } from './services/mark-bounce-to.service';
import { CallMessageWebhookService } from './services/call-message-webhook.service';

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
    CheckUserEmailStatsService,
    UpdateMessageStatusService,
    ResetQueueRateLimitService,
    MarkBounceToService,
    CallMessageWebhookService,
  ],
  exports: [
    SendEmailService,
    UpdateMessageStatusService,
    ResetQueueRateLimitService,
    MarkBounceToService,
    CallMessageWebhookService,
  ],
  controllers: [EmailController],
})
export class EmailModule {}
