import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { CreateSessionService } from '../../session/services/create-session.service';
import { UseSecurityCodeDto } from '../user.dto';
import { PERMISSIONS } from 'src/auth/permissions';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class UseSecurityCodeService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    private readonly createSessionService: CreateSessionService,
  ) {}

  async execute({ securityCode, permission }: UseSecurityCodeDto) {
    if (permission.startsWith('other') || permission.includes('admin')) {
      throw new HttpException('Invalid permission', HttpStatus.BAD_REQUEST);
    }

    const code = await this.prisma.client.securityCode.findFirst({
      where: {
        code: securityCode,
        deletedAt: null,
      },
    });

    if (!code) {
      throw new HttpException('Invalid code', HttpStatus.BAD_REQUEST);
    }

    if (code.expiresAt < new Date()) {
      throw new HttpException('Code expired', HttpStatus.BAD_REQUEST);
    }

    const user = await this.prisma.client.user.findFirst({
      where: {
        id: code.userId,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const session = this.createSessionService.execute(
      {
        permissions: [permission],
        userId: user.id,
        description: 'Session created for use the security code',
        expirationDate: new Date(new Date().getTime() + 1000 * 60 * 5),
      },
      [PERMISSIONS.SELF_ADMIN.value],
    );

    await this.prisma.client.securityCode.update({
      where: {
        id: code.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return session;
  }
}
