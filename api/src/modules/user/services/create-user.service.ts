import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user.dto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class CreateUserService {
	constructor(private readonly prisma: PrismaService) { }

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

		delete user.password
		delete user.deletedAt

		return {
			message: 'User created successfully',
			user
		}
	}
}
