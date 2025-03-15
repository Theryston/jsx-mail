import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class BetaPermissionCheckService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, permissions: string[]) {
    const betaPermissions = await this.prisma.permissionRequiresBeta.findMany({
      where: {
        deletedAt: null,
        permission: {
          in: permissions,
        },
      },
    });

    if (betaPermissions.length > 0) {
      const userBetaPermissions = await this.prisma.userBetaPermission.findMany(
        {
          where: {
            userId,
            deletedAt: null,
            permission: {
              in: betaPermissions.map((permission) => permission.permission),
            },
          },
        },
      );

      if (!userBetaPermissions.length) {
        throw new UnauthorizedException(
          `The resource ${betaPermissions[0].permission} is in beta and is not available for you. Please contact us at https://x.com/jsxmail if you want to access it.`,
        );
      }
    }
  }
}
