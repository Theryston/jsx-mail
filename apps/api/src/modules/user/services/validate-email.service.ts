import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PERMISSIONS } from 'src/auth/permissions';
import { CreateSessionService } from '../../session/services/create-session.service';
import { AddBalanceService } from './add-balance.service';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class ValidateEmailService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    private readonly createSessionService: CreateSessionService,
  ) {}

  async execute(userId: string, permissions: string[]) {
    if (!permissions.includes(PERMISSIONS.SELF_EMAIL_VALIDATE.value)) {
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

    if (user.isEmailVerified) {
      throw new HttpException('Email already verified', HttpStatus.BAD_REQUEST);
    }

    await this.prisma.client.user.update({
      where: {
        id: userId,
      },
      data: {
        isEmailVerified: true,
      },
    });

    return this.createSessionService.execute({
      userId: user.id,
      permissions: [PERMISSIONS.SELF_ADMIN.value],
      description: 'User authenticated after email verification',
      expirationDate: new Date(new Date().getTime() + 1000 * 60 * 30), // 30 minutes
    });
  }
}
