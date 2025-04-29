import { BadRequestException, Injectable } from '@nestjs/common';
import { SendEmailService } from 'src/modules/email/services/send-email.service';
import { CreateSecurityCodeDto } from '../user.dto';
import { render as jsxMailRender } from 'jsx-mail';
import moment from 'moment';
import { GetSettingsService } from './get-settings.service';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { Inject } from '@nestjs/common';

@Injectable()
export class CreateSecurityCodeService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    private readonly sendEmailService: SendEmailService,
    private readonly getSettingsService: GetSettingsService,
  ) {}

  async execute(data: CreateSecurityCodeDto) {
    const user = await this.prisma.client.user.findFirst({
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

    const settings = await this.getSettingsService.execute(user.id);

    const oneMinuteAgo = moment().startOf('minute').toDate();
    const nextMinute = moment().add(1, 'minute').startOf('minute').toDate();

    const securityCodesInLastMinute =
      await this.prisma.client.securityCode.count({
        where: {
          userId: user.id,
          createdAt: {
            gte: oneMinuteAgo,
            lte: nextMinute,
          },
        },
      });

    if (securityCodesInLastMinute >= settings.maxSecurityCodesPerMinute) {
      throw new BadRequestException(
        `You can send a security code at ${moment(nextMinute).format('HH:mm')}`,
      );
    }

    const startOfHour = moment().startOf('hour').toDate();
    const nextHour = moment().add(1, 'hour').startOf('hour').toDate();

    const securityCodesThisHour = await this.prisma.client.securityCode.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: startOfHour,
          lte: nextHour,
        },
      },
    });

    if (securityCodesThisHour >= settings.maxSecurityCodesPerHour) {
      throw new BadRequestException(
        `You can send a security code at ${moment(nextHour).format('HH:mm')}`,
      );
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(new Date().getTime() + 1000 * 60 * 5); // 5 minutes

    await this.prisma.client.securityCode.create({
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
      userId: user.id,
    });

    return {
      message: 'Security code sent successfully',
    };
  }
}
