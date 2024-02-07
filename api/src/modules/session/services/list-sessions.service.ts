import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { sessionSelect } from 'src/utils/public-selects';

@Injectable()
export class ListSessionsService {
	constructor(private readonly prisma: PrismaService) { }

	async execute(userId: string) {
		const sessions = await this.prisma.session.findMany({
			where: {
				deletedAt: {
					isSet: false
				},
				expiresAt: {
					gte: new Date()
				},
				userId
			},
			select: sessionSelect,
		})

		return sessions
	}
}
