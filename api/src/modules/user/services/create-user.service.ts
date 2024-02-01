import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user.cto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/services/prisma.service';
import { CreateSessionService } from './create-session.service';
import { PERMISSIONS } from '../../../auth/permissions';

@Injectable()
export class CreateUserService {
	constructor(private readonly prisma: PrismaService, private readonly createSessionService: CreateSessionService) { }

	async execute({ email, password, name }: CreateUserDto) {
		email = email.toLocaleLowerCase().trim()
		name = name.toLocaleLowerCase().trim()

		const userExists = await this.prisma.user.findFirst({
			where: {
				email: email,
				deletedAt: {
					isSet: false
				}
			}
		})

		if (userExists) {
			throw new HttpException('User already exists', HttpStatus.BAD_REQUEST)
		}

		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);

		const user = await this.prisma.user.create({
			data: {
				email,
				name,
				password: hashPassword,
			}
		})

		return this.createSessionService.execute({
			userId: user.id,
			permissions: [PERMISSIONS.SELF_ADMIN.value],
			expirationDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 2) // 2 hours
		})
	}
}
