import { Inject, Injectable } from '@nestjs/common';
import { SendEmailService } from 'src/modules/email/services/send-email.service';
import { UpdateMessageStatusService } from 'src/modules/email/services/update-message-status.service';
import moment from 'moment';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class ResendProcessingMessagesService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    private readonly sendEmailService: SendEmailService,
    private readonly updateMessageStatusService: UpdateMessageStatusService,
  ) {}

  async execute() {
    console.log(`[RESEND_PROCESSING_MESSAGES] started at: ${new Date()}`);

    const messagesIds: Set<string> = new Set();

    const processingMessages = await this.prisma.client.message.findMany({
      where: {
        status: 'processing',
      },
      select: {
        id: true,
      },
      // include: {
      //   sender: true,
      //   messageFiles: true,
      // },
    });

    for (const message of processingMessages) {
      messagesIds.add(message.id);
    }

    const last24Hours = moment().subtract(24, 'hours').toDate();

    const messagesQueuedMoreThan24Hours =
      await this.prisma.client.message.findMany({
        where: {
          status: 'queued',
          createdAt: {
            lte: last24Hours,
          },
        },
        select: {
          id: true,
        },
      });

    for (const message of messagesQueuedMoreThan24Hours) {
      messagesIds.add(message.id);
    }

    console.log(
      `[RESEND_PROCESSING_MESSAGES] found ${messagesIds.size} messages to resend`,
    );

    const messages = await this.prisma.client.message.findMany({
      where: {
        id: { in: Array.from(messagesIds) },
      },
      include: {
        sender: true,
        messageFiles: true,
      },
    });

    for (const message of messages) {
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
        attachmentIds: message.messageFiles.map((file) => file.fileId),
        messageId: message.id,
        userId: message.sender.userId,
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
