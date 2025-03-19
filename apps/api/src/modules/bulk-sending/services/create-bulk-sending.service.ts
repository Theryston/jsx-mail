import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { CreateBulkSendingDto } from '../bulk-sending.dto';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class CreateBulkSendingService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('bulk-sending') private readonly queue: Queue,
  ) {}

  async execute(body: CreateBulkSendingDto, userId: string) {
    const sender = await this.prisma.sender.findFirst({
      where: {
        userId,
        email: body.sender,
      },
    });

    if (!sender) {
      throw new NotFoundException('Sender not found');
    }

    const contactGroup = await this.prisma.contactGroup.findUnique({
      where: {
        id: body.contactGroupId,
        userId,
      },
      include: {
        _count: {
          select: {
            contacts: true,
          },
        },
      },
    });

    if (!contactGroup) {
      throw new NotFoundException('Contact group not found');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const bulkSending = await this.prisma.bulkSending.create({
      data: {
        sender: {
          connect: {
            id: sender.id,
          },
        },
        contactGroup: {
          connect: {
            id: contactGroup.id,
          },
        },
        subject: body.subject,
        content: body.content,
        user: {
          connect: {
            id: user.id,
          },
        },
        totalContacts: contactGroup._count.contacts,
      },
      include: {
        _count: {
          select: {
            messages: true,
            failures: true,
          },
        },
      },
    });

    await this.queue.add('send-bulk-email', {
      bulkSendingId: bulkSending.id,
    });

    return bulkSending;
  }
}
