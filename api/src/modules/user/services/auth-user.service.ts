import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthUserDto } from '../user.dto';
import { PrismaService } from 'src/services/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateSessionService } from './create-session.service';
import { PERMISSIONS } from 'src/auth/permissions';

@Injectable()
export class AuthUserService {
	constructor(private readonly prisma: PrismaService, private readonly createSessionService: CreateSessionService) { }

	async execute({ email, password }: AuthUserDto) {
		const user = await this.prisma.user.findFirst({
			where: {
				email: email,
				deletedAt: {
					isSet: false
				}
			}
		});

		if (!user) {
			throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST)
		}

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST)
		}

		const session = await this.createSessionService.execute({
			userId: user.id,
			permissions: [PERMISSIONS.SELF_ADMIN.value],
			description: 'User authenticated',
			expirationDate: new Date(new Date().getTime() + 1000 * 60 * 30) // 30 minutes
		})

		if (!user.isEmailVerified) {
			(session as any).isEmailVerified = false;
		}

		return session
	}
}
