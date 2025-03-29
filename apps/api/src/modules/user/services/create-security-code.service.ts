import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { SendEmailService } from 'src/modules/email/services/send-email.service';
import { CreateSecurityCodeDto } from '../user.dto';
import { render as jsxMailRender } from 'jsx-mail';
import moment from 'moment';
import {
  MAX_SECURITY_CODES_PER_HOUR,
  MAX_SECURITY_CODES_PER_MINUTE,
} from 'src/utils/constants';

@Injectable()
export class CreateSecurityCodeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sendEmailService: SendEmailService,
  ) {}

  async execute(data: CreateSecurityCodeDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: data.email,
        deletedAt: null,
      },
    });

    if (!user) {
      const randomTime = Math.floor(300 + Math.random() * 2000);
      await new Promise((resolve) => setTimeout(resolve, randomTime)); // Delay the response to avoid timing attacks

      return {
        message: 'Security code sent successfully',
      };
    }

    const oneMinuteAgo = moment().startOf('minute').toDate();
    const nextMinute = moment().add(1, 'minute').startOf('minute').toDate();

    const securityCodesInLastMinute = await this.prisma.securityCode.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: oneMinuteAgo,
          lte: nextMinute,
        },
      },
    });

    if (securityCodesInLastMinute >= MAX_SECURITY_CODES_PER_MINUTE) {
      throw new BadRequestException(
        `You can send a security code at ${moment(nextMinute).format('HH:mm')}`,
      );
    }

    const startOfHour = moment().startOf('hour').toDate();

    const securityCodesThisHour = await this.prisma.securityCode.count({
      where: {
        userId: user.id,
        createdAt: {
          gt: startOfHour,
        },
      },
    });

    if (securityCodesThisHour >= MAX_SECURITY_CODES_PER_HOUR) {
      throw new BadRequestException(
        `Too many security codes, please try again in the next hour`,
      );
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(new Date().getTime() + 1000 * 60 * 5); // 5 minutes

    await this.prisma.securityCode.create({
      data: {
        userId: user.id,
        code,
        expiresAt,
      },
    });

    const htmlCode = await jsxMailRender('user:security-code', {
      code,
      expiresAt,
    });

    await this.sendEmailService.execute({
      from: {
        name: 'JSX Mail Cloud',
        email: process.env.DEFAULT_SENDER_EMAIL,
      },
      to: [user.email],
      subject: 'Your security code',
      html: htmlCode,
    });

    return {
      message: 'Security code sent successfully',
    };
  }
}
