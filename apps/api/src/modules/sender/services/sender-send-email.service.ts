import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SendEmailService } from 'src/modules/email/services/send-email.service';
import { GetBalanceService } from 'src/modules/user/services/get-balance.service';
import { PrismaService } from 'src/services/prisma.service';
import { SenderSendEmailDto } from '../sender.dto';
import { PRICE_PER_MESSAGE } from 'src/utils/constants';
import { messageSelect } from 'src/utils/public-selects';
import moment from 'moment';
import { Sender } from '@prisma/client';

@Injectable()
export class SenderSendEmailService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly getBalanceService: GetBalanceService,
    private readonly sendEmailService: SendEmailService,
  ) {}

  async execute(
    { sender: senderEmail, html, subject, to }: SenderSendEmailDto,
    userId: string,
  ) {
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

    const balance = await this.getBalanceService.execute(userId);

    if (balance.amount < PRICE_PER_MESSAGE) {
      throw new HttpException('Insufficient balance', HttpStatus.BAD_REQUEST);
    }

    let message = await this.prisma.message.create({
      data: {
        body: html,
        subject,
        to,
        domainId: sender.domainId,
        senderId: sender.id,
        userId,
        createdDay: moment().format('YYYY-MM-DD'),
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
    });

    return message;
  }
}
