import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SendEmailService } from 'src/modules/email/services/send-email.service';
import { GetBalanceService } from 'src/modules/user/services/get-balance.service';
import { PrismaService } from 'src/services/prisma.service';
import { SenderSendEmailDto } from '../sender.dto';
import { FREE_EMAILS_PER_MONTH, PRICE_PER_MESSAGE } from 'src/utils/constants';
import { messageSelect } from 'src/utils/public-selects';
import moment from 'moment';
import { Sender } from '@prisma/client';
import { BetaPermissionCheckService } from 'src/modules/user/services/beta-permission-check.service';
import { PERMISSIONS } from 'src/auth/permissions';

@Injectable()
export class SenderSendEmailService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly getBalanceService: GetBalanceService,
    private readonly sendEmailService: SendEmailService,
    private readonly betaPermissionCheckService: BetaPermissionCheckService,
  ) {}

  async execute(
    {
      sender: senderEmail,
      html,
      subject,
      to,
      filesIds,
      bulkSendingId,
      customPayload,
      contactId,
      delay,
    }: SenderSendEmailDto,
    userId: string,
  ) {
    if (filesIds && filesIds.length > 0) {
      await this.betaPermissionCheckService.execute(userId, [
        PERMISSIONS.SELF_SEND_EMAIL_WITH_ATTACHMENTS.value,
      ]);
    }

    let sender: Sender | null = null;

    if (senderEmail) {
      sender = await this.prisma.sender.findFirst({
        where: {
          email: senderEmail,
          userId,
          deletedAt: null,
        },
      });
    } else {
      sender = await this.prisma.sender.findFirst({
        where: {
          userId,
          deletedAt: null,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    if (!sender) {
      throw new HttpException(
        'Sender not found, please create one',
        HttpStatus.NOT_FOUND,
      );
    }

    const messagesCount = await this.prisma.message.count({
      where: {
        userId,
        deletedAt: null,
        sentAt: {
          gte: moment().startOf('month').toDate(),
          not: null,
        },
      },
    });

    if (messagesCount + 1 > FREE_EMAILS_PER_MONTH) {
      const balance = await this.getBalanceService.execute(userId);

      if (balance.amount < PRICE_PER_MESSAGE) {
        throw new HttpException('Insufficient balance', HttpStatus.BAD_REQUEST);
      }
    }

    let message = await this.prisma.message.create({
      data: {
        body: html,
        subject,
        to,
        domainId: sender.domainId,
        senderId: sender.id,
        userId,
        contactId,
        createdDay: moment().format('YYYY-MM-DD'),
        messageFiles: filesIds
          ? {
              create: filesIds.map((fileId) => ({
                file: {
                  connect: {
                    id: fileId,
                  },
                },
              })),
            }
          : undefined,
        bulkSendingId,
        customPayload: customPayload
          ? JSON.stringify(customPayload)
          : undefined,
      },
      select: messageSelect,
    });

    await this.sendEmailService.execute({
      from: {
        name: sender.name,
        email: sender.email,
      },
      html,
      subject,
      to,
      messageId: message.id,
      filesIds,
      bulkSendingId,
      customPayload,
      delay,
    });

    return message;
  }
}
