import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { ImpersonateUserDto } from '../user.dto';
import { PERMISSIONS } from 'src/auth/permissions';
import { CreateSessionService } from 'src/modules/session/services/create-session.service';

@Injectable()
export class ImpersonateUserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly createSessionService: CreateSessionService,
  ) {}

  async execute(data: ImpersonateUserDto, currentUserId: string) {
    if (!currentUserId) {
      throw new UnauthorizedException('Unauthorized');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentUser = await this.prisma.user.findUnique({
      where: { id: currentUserId },
    });

    if (!currentUser) {
      throw new NotFoundException('Current user not found');
    }

    if (currentUser.accessLevel !== 'other') {
      throw new UnauthorizedException('Unauthorized');
    }

    let defaultPermissions = [PERMISSIONS.SELF_ADMIN.value];

    if (user.accessLevel === 'other') {
      defaultPermissions = [PERMISSIONS.OTHER_ADMIN.value];
    }

    const session = await this.createSessionService.execute({
      userId: user.id,
      permissions: defaultPermissions,
      description: 'Some admin impersonated this user',
      expirationDate: new Date(new Date().getTime() + 1000 * 60 * 30), // 30 minutes
      impersonateUserId: currentUserId,
    });

    if (!user.isEmailVerified) {
      (session as any).isEmailVerified = false;
    }

    return session;
  }
}
