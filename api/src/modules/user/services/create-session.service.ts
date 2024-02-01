import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { CreateSessionDto } from '../user.dto';
import crypto from 'crypto';
import { PERMISSIONS } from '../../../auth/permissions';

@Injectable()
export class CreateSessionService {
	constructor(private readonly prisma: PrismaService) { }

	async execute({ userId, expirationDate, permissions, description }: CreateSessionDto) {
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

		const token = crypto.randomBytes(32).toString('hex');

		const session = await this.prisma.session.create({
			data: {
				userId,
				token,
				expiresAt: expirationDate,
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
