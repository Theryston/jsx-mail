import { Module, forwardRef } from '@nestjs/common';
import { SendEmailService } from './services/send-email.service';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './email.processor';
import { EmailController } from './email.controller';
import { EmailWebhookService } from './services/email-webhook.service';
import { UserModule } from '../user/user.module';
import { CheckUserEmailStatsService } from './services/check-user-email-stats.service';
import { UpdateMessageStatusService } from './services/update-message-status.service';
import { ResetQueueRateLimitService } from './services/reset-queue-rate-limit.service';
import { MarkBounceToService } from './services/mark-bounce-to.service';
import { CallMessageWebhookService } from './services/call-message-webhook.service';
import { MarkComplaintToService } from './services/mark-complaint-to.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  providers: [
    SendEmailService,
    EmailProcessor,
    EmailWebhookService,
    CheckUserEmailStatsService,
    UpdateMessageStatusService,
    ResetQueueRateLimitService,
    MarkBounceToService,
    CallMessageWebhookService,
    MarkComplaintToService,
  ],
  exports: [
    SendEmailService,
    UpdateMessageStatusService,
    ResetQueueRateLimitService,
    MarkBounceToService,
    CallMessageWebhookService,
    MarkComplaintToService,
  ],
  controllers: [EmailController],
})
export class EmailModule {}
