import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { BlockPermissionDto } from '../user.dto';

@Injectable()
export class BlockPermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: BlockPermissionDto) {
    const { permission, userId } = data;

    await this.prisma.blockedPermission.create({
      data: {
        permission,
        userId,
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
