import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { BlockPermissionDto } from '../user.dto';

@Injectable()
export class BlockPermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: BlockPermissionDto) {
    const { permission, userId, reason } = data;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.email === process.env.DEFAULT_USER_EMAIL) {
      throw new BadRequestException('Cannot block the default user');
    }

    const isUserAlreadyBlocked = await this.prisma.blockedPermission.findFirst({
      where: {
        userId,
        permission,
        deletedAt: null,
      },
    });

    if (isUserAlreadyBlocked) {
      throw new BadRequestException('Permission already blocked');
    }

    await this.prisma.blockedPermission.create({
      data: {
        permission,
        userId,
        reason,
      },
    });

    await this.prisma.blockedPermissionEvent.create({
      data: {
        permission,
        userId,
        style: 'block',
      },
    });

    return {
      message: 'Permission blocked successfully',
    };
  }

  async delete(data: BlockPermissionDto) {
    const { permission, userId } = data;

    await this.prisma.blockedPermission.deleteMany({
      where: { permission, userId },
    });

    await this.prisma.blockedPermissionEvent.create({
      data: {
        permission,
        userId,
        style: 'unblock',
      },
    });

    return {
      message: 'Permission blocked successfully',
    };
  }

  async get(userId: string) {
    const blockedPermissions = await this.prisma.blockedPermission.findMany({
      where: { userId },
    });

    return blockedPermissions.map((permission) => permission.permission);
  }
}
