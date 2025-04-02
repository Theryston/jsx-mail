import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageStatus } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/services/prisma.service';
import moment from 'moment';

@Injectable()
export class UpdateMessageStatusService {
  constructor(private prisma: PrismaService) {}

  async execute(
    messageId: string,
    newStatus: MessageStatus,
    description?: string,
  ) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    await this.prisma.messageStatusHistory.create({
      data: {
        messageId,
        status: newStatus,
        description,
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
      data = {
        ...data,
        sentAt: new Date(),
        chargeMonth: moment().format('YYYY-MM'),
        sentDay: moment().format('YYYY-MM-DD'),
      };
    }

    await this.prisma.message.update({
      where: { id: message.id },
      data,
    });
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
