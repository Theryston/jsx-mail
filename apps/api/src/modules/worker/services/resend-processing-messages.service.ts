import { Injectable } from '@nestjs/common';
import { SendEmailService } from 'src/modules/email/services/send-email.service';
import { PrismaService } from 'src/services/prisma.service';
import { UpdateMessageStatusService } from 'src/modules/email/services/update-message-status.service';
@Injectable()
export class ResendProcessingMessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sendEmailService: SendEmailService,
    private readonly updateMessageStatusService: UpdateMessageStatusService,
  ) {}

  async execute() {
    console.log(`[RESEND_PROCESSING_MESSAGES] started at: ${new Date()}`);

    const processingMessages = await this.prisma.message.findMany({
      where: {
        status: 'processing',
      },
      include: {
        sender: true,
        messageFiles: true,
      },
    });

    console.log(
      `[RESEND_PROCESSING_MESSAGES] found ${processingMessages.length} processing messages`,
    );

    for (const message of processingMessages) {
      await this.sendEmailService.execute({
        from: {
          email: message.sender.email,
          name: message.sender.name,
        },
        to: message.to,
        subject: message.subject,
        html: message.body,
        bulkSendingId: message.bulkSendingId,
        customPayload: message.customPayload
          ? JSON.parse(message.customPayload)
          : {},
        delay: 0,
        filesIds: message.messageFiles.map((file) => file.fileId),
        messageId: message.id,
      });

      await this.updateMessageStatusService.execute(
        message.id,
        'queued',
        'Resending message',
      );

      console.log(
        `[RESEND_PROCESSING_MESSAGES] re-sended message ${message.id}`,
      );
    }

    console.log(`[RESEND_PROCESSING_MESSAGES] finished at: ${new Date()}`);
  }
}
