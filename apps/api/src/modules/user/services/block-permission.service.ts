import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BlockPermissionDto } from '../user.dto';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { Inject } from '@nestjs/common';

@Injectable()
export class BlockPermissionService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async create(data: BlockPermissionDto) {
    const { permission, userId, reason } = data;

    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.email === process.env.DEFAULT_USER_EMAIL) {
      throw new BadRequestException('Cannot block the default user');
    }

    const isUserAlreadyBlocked =
      await this.prisma.client.blockedPermission.findFirst({
        where: {
          userId,
          permission,
          deletedAt: null,
        },
      });

    if (isUserAlreadyBlocked) {
      throw new BadRequestException('Permission already blocked');
    }

    await this.prisma.client.blockedPermission.create({
      data: {
        permission,
        userId,
        reason,
      },
    });

    await this.prisma.client.blockedPermissionEvent.create({
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

    await this.prisma.client.blockedPermission.deleteMany({
      where: { permission, userId },
    });

    await this.prisma.client.blockedPermissionEvent.create({
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
    const blockedPermissions =
      await this.prisma.client.blockedPermission.findMany({
        where: { userId },
      });

    return blockedPermissions.map((permission) => permission.permission);
  }
}
