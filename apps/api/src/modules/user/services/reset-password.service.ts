import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ResetPasswordDto } from '../user.dto';
import { PERMISSIONS } from 'src/auth/permissions';
import * as bcrypt from 'bcryptjs';
import { CreateSessionService } from '../../session/services/create-session.service';
import { SendEmailService } from 'src/modules/email/services/send-email.service';
import { render as jsxMailRender } from 'jsx-mail';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { Inject } from '@nestjs/common';

type ResetPassword = {
  userId: string;
  permissions: string[];
} & ResetPasswordDto;

@Injectable()
export class ResetPasswordService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    private readonly createSessionService: CreateSessionService,
    private readonly sendEmailService: SendEmailService,
  ) {}

  async execute({ newPassword, userId, permissions }: ResetPassword) {
    if (!permissions.includes(PERMISSIONS.SELF_RESET_PASSWORD.value)) {
      throw new HttpException('Invalid permission', HttpStatus.BAD_REQUEST);
    }

    const user = await this.prisma.client.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    await this.prisma.client.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashPassword,
      },
    });

    const session = await this.createSessionService.execute({
      userId: user.id,
      permissions: [PERMISSIONS.SELF_ADMIN.value],
      description: 'User authenticated after password reset',
      expirationDate: new Date(new Date().getTime() + 1000 * 60 * 30), // 30 minutes
    });

    if (!user.isEmailVerified) {
      (session as any).isEmailVerified = false;
      (session as any).email = user.email;
    }

    const htmlCode = await jsxMailRender('user:password-redefined');

    await this.sendEmailService.execute({
      from: {
        name: 'JSX Mail Cloud',
        email: process.env.DEFAULT_SENDER_EMAIL,
      },
      to: [user.email],
      subject: 'Your password has been reset',
      html: htmlCode,
      userId: user.id,
    });

    return session;
  }
}
