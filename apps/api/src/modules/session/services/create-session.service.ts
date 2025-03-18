import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import crypto from 'crypto';
import { PERMISSIONS } from '../../../auth/permissions';
import { CreateSessionDto } from '../session.dto';
import moment from 'moment';

type CreateSessionData = {
  userId: string;
} & CreateSessionDto;

@Injectable()
export class CreateSessionService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    {
      userId,
      expirationDate,
      permissions,
      description,
      impersonateUserId,
    }: CreateSessionData,
    notAllowedPermission = [
      PERMISSIONS.SELF_EMAIL_VALIDATE.value,
      PERMISSIONS.SELF_RESET_PASSWORD.value,
    ],
  ) {
    if (!permissions || !permissions.length) {
      throw new HttpException('Please add permissions', HttpStatus.BAD_REQUEST);
    }

    const notValidPermissions = permissions.some(
      (permission) =>
        !Object.keys(PERMISSIONS)
          .map((k) => PERMISSIONS[k].value)
          .includes(permission),
    );

    if (notValidPermissions) {
      throw new HttpException('Invalid permissions', HttpStatus.BAD_REQUEST);
    }

    const notAllowedPermissions = notAllowedPermission.filter((p) =>
      permissions.includes(p),
    );

    if (notAllowedPermissions.length) {
      throw new HttpException(
        `You can't access ${notAllowedPermissions.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!userId) {
      throw new HttpException('User id is required', HttpStatus.BAD_REQUEST);
    }

    const expiration = expirationDate ? moment(expirationDate) : undefined;

    if (expiration && expiration.isBefore(moment())) {
      throw new HttpException(
        'The expiration date must be in the future',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (
      user.accessLevel !== 'other' &&
      permissions.some((p) => !p.startsWith('self:'))
    ) {
      throw new HttpException(
        'You only can access self permissions',
        HttpStatus.FORBIDDEN,
      );
    }

    const token = crypto.randomBytes(32).toString('hex');

    const session = await this.prisma.session.create({
      data: {
        userId,
        token,
        expiresAt: expiration ? expiration.toDate() : null,
        permissions,
        description,
        impersonateUserId,
      },
    });

    return {
      token,
      sessionId: session.id,
      expiresAt: session.expiresAt || 'never',
    };
  }
}
