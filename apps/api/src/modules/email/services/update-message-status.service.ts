import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Message, MessageStatus, PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';
import moment from 'moment';
import { MarkBounceToService } from './mark-bounce-to.service';
import { MessageExtra } from 'src/utils/types';
import { CallMessageWebhookService } from './call-message-webhook.service';
import { CustomPrismaService } from 'nestjs-prisma';

const STATUS_SHOULD_HAVE_SENT_AT: MessageStatus[] = [
  'bounce',
  'clicked',
  'complaint',
  'delivered',
  'opened',
  'reject',
  'subscription',
];

@Injectable()
export class UpdateMessageStatusService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    private markBounceToService: MarkBounceToService,
    private callMessageWebhookService: CallMessageWebhookService,
  ) {}

  async execute(
    messageId: string,
    newStatus: MessageStatus,
    description?: string,
    extra?: MessageExtra,
    messageData?: Prisma.MessageUpdateInput,
  ) {
    extra = extra || {};

    const message = await this.prisma.client.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    newStatus = await this.processStatusMapping(message, newStatus);

    const entries = Object.entries(extra);
    const extras = entries.map(([key, value]) => ({
      key,
      value,
    }));

    await this.prisma.client.messageStatusHistory.create({
      data: {
        messageId,
        status: newStatus,
        description,
        extras: extras.length > 0 ? { create: extras } : undefined,
      },
    });

    if (this.shouldNotUpdateStatus(message.status, newStatus)) {
      console.log(
        `[UPDATE_MESSAGE_STATUS_SERVICE] ignoring status update from ${message.status} to ${newStatus}`,
      );
      return;
    }

    let data: Prisma.MessageUpdateInput = {
      ...messageData,
      status: newStatus,
    };

    if (newStatus === 'sent') {
      data = this.addSentDate(data);
    } else if (
      STATUS_SHOULD_HAVE_SENT_AT.includes(newStatus) &&
      message.sentAt === null
    ) {
      data = this.addSentDate(data);
    }

    if (newStatus === 'bounce' && message.contactId) {
      await this.prisma.client.contact.update({
        where: { id: message.contactId },
        data: {
          bouncedAt: new Date(),
          bouncedBy: 'message',
        },
      });
    }

    if (newStatus === 'bounce') {
      for (const to of message.to) {
        await this.markBounceToService.create(to, 'message');
      }
    }

    await this.prisma.client.message.update({
      where: { id: message.id },
      data,
    });

    await this.callMessageWebhookService.execute(message.id);
  }

  private addSentDate(data: Prisma.MessageUpdateInput) {
    return {
      ...data,
      sentAt: new Date(),
      chargeMonth: moment().format('YYYY-MM'),
      sentDay: moment().format('YYYY-MM-DD'),
    };
  }

  private async processStatusMapping(
    message: Message,
    newStatus: MessageStatus,
  ): Promise<MessageStatus> {
    const statusMapping =
      await this.prisma.client.messageStatusMapping.findFirst({
        where: {
          whenMessageStatus: message.status,
          whenNewStatus: newStatus,
          userId: message.userId,
          deletedAt: null,
        },
      });

    if (!statusMapping) return newStatus;

    console.log(
      `[UPDATE_MESSAGE_STATUS_SERVICE] status mapping found for ${message.status} to ${newStatus}. It will be replaced to ${statusMapping.replaceNewStatusTo}`,
    );

    await this.prisma.client.messageStatusReplaced.create({
      data: {
        messageId: message.id,
        oldStatus: message.status,
        originalNewStatus: newStatus,
        replacedNewStatus: statusMapping.replaceNewStatusTo,
      },
    });

    return statusMapping.replaceNewStatusTo;
  }

  private shouldNotUpdateStatus(
    currentStatus: MessageStatus,
    newStatus: MessageStatus,
  ): boolean {
    const statusPriority: Record<MessageStatus, number> = {
      clicked: 5,
      opened: 4,
      bounce: 3,
      delivered: 2,
      sent: 1,
      complaint: 1,
      failed: 1,
      reject: 1,
      delivery_delay: 1,
      subscription: 1,
      queued: 0,
      processing: 0,
    };

    return (
      (statusPriority[currentStatus] || 0) > (statusPriority[newStatus] || 0)
    );
  }
}
