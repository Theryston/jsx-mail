import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import crypto from 'crypto';
import { PERMISSIONS } from '../../../auth/permissions';
import { CreateSessionDto } from '../session.dto';

type CreateSessionData = {
	userId: string;
} & CreateSessionDto

@Injectable()
export class CreateSessionService {
	constructor(private readonly prisma: PrismaService) { }

	async execute({ userId, expirationDate, permissions, description }: CreateSessionData, notAllowedPermission = [PERMISSIONS.SELF_EMAIL_VALIDATE.value, PERMISSIONS.SELF_RESET_PASSWORD.value]) {
		const user = await this.prisma.user.findFirst({
			where: {
				id: userId,
				deletedAt: {
					isSet: false
				}
			}
		});

		if (!user) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND)
		}

		const notValidPermissions = permissions.some(permission => !Object.keys(PERMISSIONS).map(k => PERMISSIONS[k].value).includes(permission))

		if (notValidPermissions) {
			throw new HttpException('Invalid permissions', HttpStatus.BAD_REQUEST)
		}

		if (user.accessLevel !== 'other' && permissions.some(p => !p.startsWith('self:'))) {
			throw new HttpException('You only can access self permissions', HttpStatus.FORBIDDEN)
		}

		if (notAllowedPermission.some(p => permissions.includes(p))) {
			throw new HttpException('You can not use this permissions', HttpStatus.FORBIDDEN)
		}

		const token = crypto.randomBytes(32).toString('hex');

		const session = await this.prisma.session.create({
			data: {
				userId,
				token,
				expiresAt: expirationDate ? new Date(expirationDate) : null,
				permissions,
				description
			}
		})

		return {
			token,
			sessionId: session.id,
			expiresAt: session.expiresAt || 'never'
		}
	}
}
