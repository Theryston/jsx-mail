import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { Inject } from '@nestjs/common';

@Injectable()
export class BetaPermissionCheckService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(userId: string, permissions: string[]) {
    if (!permissions || permissions.length === 0) {
      return;
    }

    const betaPermissions =
      await this.prisma.client.permissionRequiresBeta.findMany({
        where: {
          deletedAt: null,
          permission: {
            in: permissions,
          },
        },
      });

    if (betaPermissions.length > 0) {
      const userBetaPermissions =
        await this.prisma.client.userBetaPermission.findMany({
          where: {
            userId,
            deletedAt: null,
            permission: {
              in: betaPermissions.map((permission) => permission.permission),
            },
          },
        });

      if (!userBetaPermissions.length) {
        throw new UnauthorizedException(
          `The resource ${betaPermissions[0].permission} is in beta and is not available for you. Please contact us at https://x.com/jsxmail if you want to access it.`,
        );
      }
    }
  }
}
