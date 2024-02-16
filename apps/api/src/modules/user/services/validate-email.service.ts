import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PERMISSIONS } from 'src/auth/permissions';
import { PrismaService } from 'src/services/prisma.service';
import { CreateSessionService } from '../../session/services/create-session.service';
import { AddBalanceService } from './add-balance.service';
import { FREE_BALANCE } from 'src/utils/constants';

@Injectable()
export class ValidateEmailService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly createSessionService: CreateSessionService,
    private readonly addBalanceService: AddBalanceService,
  ) {}

  async execute(userId: string, permissions: string[]) {
    if (!permissions.includes(PERMISSIONS.SELF_EMAIL_VALIDATE.value)) {
      throw new HttpException('Invalid permission', HttpStatus.BAD_REQUEST);
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: {
          isSet: false,
        },
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.isEmailVerified) {
      throw new HttpException('Email already verified', HttpStatus.BAD_REQUEST);
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isEmailVerified: true,
      },
    });

    await this.addBalanceService.execute({
      amount: FREE_BALANCE,
      style: 'earn_free',
      userId: userId,
      description: 'Earning from email verification',
    });

    return this.createSessionService.execute({
      userId: user.id,
      permissions: [PERMISSIONS.SELF_ADMIN.value],
      description: 'User authenticated after email verification',
      expirationDate: new Date(new Date().getTime() + 1000 * 60 * 30), // 30 minutes
    });
  }
}
