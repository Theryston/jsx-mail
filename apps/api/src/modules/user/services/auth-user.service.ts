import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthUserDto } from '../user.dto';
import * as bcrypt from 'bcryptjs';
import { CreateSessionService } from '../../session/services/create-session.service';
import { PERMISSIONS } from 'src/auth/permissions';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { Inject } from '@nestjs/common';

@Injectable()
export class AuthUserService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    private readonly createSessionService: CreateSessionService,
  ) {}

  async execute({ email, password }: AuthUserDto) {
    const user = await this.prisma.client.user.findFirst({
      where: {
        email: email,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    let defaultPermissions = [PERMISSIONS.SELF_ADMIN.value];

    if (user.accessLevel === 'other') {
      defaultPermissions = [PERMISSIONS.OTHER_ADMIN.value];
    }

    const session = await this.createSessionService.execute({
      userId: user.id,
      permissions: defaultPermissions,
      description: 'User authenticated',
      expirationDate: new Date(new Date().getTime() + 1000 * 60 * 30), // 30 minutes
    });

    if (!user.isEmailVerified) {
      (session as any).isEmailVerified = false;
    }

    return session;
  }
}
