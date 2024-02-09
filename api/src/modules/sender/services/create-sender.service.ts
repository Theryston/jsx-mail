import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSenderDto } from '../sender.dto';
import { PrismaService } from 'src/services/prisma.service';
import { senderSelect } from 'src/utils/public-selects';

@Injectable()
export class CreateSenderService {
	constructor(private readonly prisma: PrismaService) { }

	async execute({ domainName, username, name }: CreateSenderDto, userId: string) {
		username = username.toLowerCase().trim();

		const domainWhere = {
			name: domainName,
			userId,
			deletedAt: {
				isSet: false
			}
		}

		if (domainName === process.env.DEFAULT_EMAIL_DOMAIN_NAME) {
			delete domainWhere.userId
		}

		const domain = await this.prisma.domain.findFirst({
			where: domainWhere
		});

		if (!domain) {
			throw new HttpException('Domain not found', HttpStatus.NOT_FOUND);
		}

		const email = `${username}@${domain.name}`

		const senderExists = await this.prisma.sender.findFirst({
			where: {
				email,
				deletedAt: {
					isSet: false
				}
			}
		})

		if (senderExists) {
			throw new HttpException('An user has already registered this sender', HttpStatus.CONFLICT);
		}

		const sender = await this.prisma.sender.create({
			data: {
				username,
				email,
				domainId: domain.id,
				userId,
				name
			},
			select: senderSelect
		})

		return sender
	}
}
