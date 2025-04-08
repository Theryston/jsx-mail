import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageStatus } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/services/prisma.service';
import moment from 'moment';
import { MarkBounceToService } from './mark-bounce-to.service';
import { MessageExtra } from 'src/utils/types';

const STATUS_SHOULD_HAVE_SENT_AT: MessageStatus[] = [
  'bonce',
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
    private prisma: PrismaService,
    private markBounceToService: MarkBounceToService,
  ) {}

  async execute(
    messageId: string,
    newStatus: MessageStatus,
    description?: string,
    extra?: MessageExtra,
  ) {
    extra = extra || {};

    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    const entries = Object.entries(extra);
    const extras = entries.map(([key, value]) => ({
      key,
      value,
    }));

    await this.prisma.messageStatusHistory.create({
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

    if (newStatus === 'bonce' && message.contactId) {
      await this.prisma.contact.update({
        where: { id: message.contactId },
        data: {
          bouncedAt: new Date(),
          bouncedBy: 'message',
        },
      });
    }

    if (newStatus === 'bonce') {
      for (const to of message.to) {
        await this.markBounceToService.create(to, 'message');
      }
    }

    await this.prisma.message.update({
      where: { id: message.id },
      data,
    });
  }

  private addSentDate(data: Prisma.MessageUpdateInput) {
    return {
      ...data,
      sentAt: new Date(),
      chargeMonth: moment().format('YYYY-MM'),
      sentDay: moment().format('YYYY-MM-DD'),
    };
  }

  private shouldNotUpdateStatus(
    currentStatus: MessageStatus,
    newStatus: MessageStatus,
  ): boolean {
    const statusPriority: Record<MessageStatus, number> = {
      clicked: 5,
      opened: 4,
      bonce: 3,
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
