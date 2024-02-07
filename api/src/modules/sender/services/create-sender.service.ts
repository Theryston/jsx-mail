import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSenderDto } from '../sender.dto';
import { PrismaService } from 'src/services/prisma.service';
import { senderSelect } from 'src/utils/public-selects';

@Injectable()
export class CreateSenderService {
	constructor(private readonly prisma: PrismaService) { }

	async execute({ domainName, username }: CreateSenderDto, userId: string) {
		username = username.toLowerCase().trim();

		const domain = await this.prisma.domain.findFirst({
			where: {
				name: domainName,
				userId,
				deletedAt: {
					isSet: false
				}
			}
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
			throw new HttpException('Sender already exists', HttpStatus.CONFLICT);
		}

		const sender = await this.prisma.sender.create({
			data: {
				username,
				email,
				domainId: domain.id,
				userId
			},
			select: senderSelect
		})

		return sender
	}
}
