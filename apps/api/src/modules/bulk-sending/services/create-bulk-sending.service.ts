import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { CreateBulkSendingDto } from '../bulk-sending.dto';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { BulkSendingVariableFrom } from '@prisma/client';
import { GetUserLimitsService } from 'src/modules/user/services/get-user-limits.service';

const AVAILABLE_KEYS = {
  contact: ['name', 'email', 'unsubscribeUrl', 'createdAt'],
  bulk_sending: ['createdAt'],
};

@Injectable()
export class CreateBulkSendingService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('bulk-sending') private readonly queue: Queue,
    private readonly getUserLimitsService: GetUserLimitsService,
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
            contacts: {
              where: {
                deletedAt: null,
                bouncedAt: null,
                bouncedBy: null,
              },
            },
          },
        },
      },
    });

    if (!contactGroup) {
      throw new NotFoundException('Contact group not found');
    }

    if (contactGroup._count.contacts === 0) {
      throw new BadRequestException(
        'You can not send emails to an empty contact group',
      );
    }

    const processingContactImport = await this.prisma.contactImport.findFirst({
      where: {
        userId,
        contactGroupId: contactGroup.id,
        status: {
          in: ['processing', 'pending'],
        },
      },
    });

    if (processingContactImport) {
      throw new BadRequestException(
        'Wait for the contact import to finish before sending emails',
      );
    }

    const processingEmailCheck = await this.prisma.bulkEmailCheck.findFirst({
      where: {
        userId,
        contactGroupId: contactGroup.id,
        status: {
          in: ['processing', 'pending'],
        },
      },
    });

    if (processingEmailCheck) {
      throw new BadRequestException(
        'Wait for the email check to finish before sending emails',
      );
    }

    const hasUnsubscribeLink = body.content.includes('{{unsubscribeUrl}}');

    if (!hasUnsubscribeLink) {
      throw new BadRequestException(
        'You must add a link to unsubscribe in the content',
      );
    }

    const customVariablesWithoutValue = body.variables.filter(
      (v) => v.from === 'custom' && !v.customValue,
    );

    if (customVariablesWithoutValue.length > 0) {
      throw new BadRequestException(
        `Please add a customValue to the custom variables: ${customVariablesWithoutValue.map(
          (v) => v.key,
        )}`,
      );
    }

    const variablesWithInvalidKeys = body.variables.filter(
      (v) => v.from !== 'custom' && !AVAILABLE_KEYS[v.from].includes(v.fromKey),
    );

    if (variablesWithInvalidKeys.length > 0) {
      throw new BadRequestException(
        `Invalid keys: ${variablesWithInvalidKeys.map((v) => v.key)}`,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const { availableMessages } =
      await this.getUserLimitsService.execute(userId);

    if (availableMessages < contactGroup._count.contacts) {
      throw new BadRequestException(
        `You have ${availableMessages} emails left (counted as free or balance), but you are trying to send ${contactGroup._count.contacts} emails. Add more balance to your account to send more emails.`,
      );
    }

    const bulkSending = await this.prisma.bulkSending.create({
      data: {
        title: body.title,
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
        variables: {
          createMany: {
            data: body.variables.map((v) => {
              let from: BulkSendingVariableFrom = 'custom';

              if (v.from === 'contact') from = 'contact';
              if (v.from === 'bulk_sending') from = 'bulk_sending';

              return {
                key: v.key,
                from,
                fromKey: v.fromKey,
                customValue: v.customValue,
              };
            }),
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
