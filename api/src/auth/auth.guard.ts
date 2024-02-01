import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permissions } from './permissions.decorator';
import { PrismaService } from 'src/services/prisma.service';
import { PERMISSIONS, PRIVATE_ROUTES_CAN_BE_USED_NOT_EMAIL_VERIFIED } from './permissions';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly prisma: PrismaService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get(Permissions, context.getHandler());

    if (!permissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      return false;
    }

    const session = await this.prisma.session.findFirst({
      where: {
        AND: [
          {
            token,
            deletedAt: {
              isSet: false
            }
          },
          {
            OR: [{
              expiresAt: {
                gte: new Date()
              }
            }, {
              expiresAt: {
                isSet: false
              }
            }]
          }
        ]
      }
    });

    if (!session) {
      return false;
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id: session.userId,
        deletedAt: {
          isSet: false
        }
      },
    });

    delete user.password;

    const route = context.switchToHttp().getRequest().route.path;

    if (!user.isEmailVerified && !PRIVATE_ROUTES_CAN_BE_USED_NOT_EMAIL_VERIFIED.includes(route)) {
      return false;
    }

    if (permissions.every(permission => permission.startsWith('self:') && session.permissions.includes(PERMISSIONS.SELF_ADMIN.value))) {
      request.user = user;
      request.permissions = permissions
      return true;
    }

    if (session.permissions.includes(PERMISSIONS.OTHER_ADMIN.value)) {
      request.user = user;
      request.permissions = permissions
      return true;
    }

    if (permissions.every(permission => session.permissions.includes(permission))) {
      request.user = user;
      request.permissions = permissions
      return true;
    }

    return false;
  }
}
