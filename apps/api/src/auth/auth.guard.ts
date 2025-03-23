import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permissions } from './permissions.decorator';
import { PrismaService } from 'src/services/prisma.service';
import { PERMISSIONS } from './permissions';
import { GetBalanceService } from 'src/modules/user/services/get-balance.service';
import { BetaPermissionCheckService } from 'src/modules/user/services/beta-permission-check.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
    private readonly getBalanceService: GetBalanceService,
    private readonly betaPermissionCheckService: BetaPermissionCheckService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get(Permissions, context.getHandler());

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token && !permissions) {
      return true;
    }

    if (!token && permissions) {
      return false;
    }

    const session = await this.prisma.session.findFirst({
      where: {
        AND: [
          {
            token,
            deletedAt: null,
          },
          {
            OR: [
              {
                expiresAt: {
                  gte: new Date(),
                },
              },
              {
                expiresAt: null,
              },
            ],
          },
        ],
      },
    });

    if (!session && !permissions) {
      return true;
    }

    if (!session && permissions) {
      return false;
    }

    request.permissions = session.permissions;
    request.session = session;

    const user = await this.prisma.user.findFirst({
      where: {
        id: session.userId,
        deletedAt: null,
      },
    });

    if (!user) {
      return false;
    }

    await this.betaPermissionCheckService.execute(user.id, permissions);

    delete user.password;
    delete user.deletedAt;

    (user as any).balance = await this.getBalanceService.execute(user.id);

    request.user = user;

    const route = context.switchToHttp().getRequest().route.path;

    if (
      !user.isEmailVerified &&
      !['/user/validate-email', '/user/auth', '/user/security-code'].includes(
        route,
      )
    ) {
      return false;
    }

    if (!permissions) {
      return true;
    }

    const blockedPermissions = await this.prisma.blockedPermission.findMany({
      where: {
        userId: user.id,
        deletedAt: null,
      },
    });

    request.blockedPermissions = blockedPermissions;

    if (
      blockedPermissions.find((permission) =>
        permissions.includes(permission.permission),
      )
    ) {
      throw new HttpException(
        `You was blocked from using this permission: ${blockedPermissions[0].permission}`,
        HttpStatus.FORBIDDEN,
      );
    }

    if (
      permissions.every(
        (permission) =>
          permission.startsWith('self:') &&
          session.permissions.includes(PERMISSIONS.SELF_ADMIN.value),
      )
    ) {
      return true;
    }

    if (session.permissions.includes(PERMISSIONS.OTHER_ADMIN.value)) {
      return true;
    }

    if (
      permissions.every((permission) =>
        session.permissions.includes(permission),
      )
    ) {
      return true;
    }

    return false;
  }
}
