import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { sessionSelect } from 'src/utils/public-selects';

@Injectable()
export class ListSessionsService {
	constructor(private readonly prisma: PrismaService) { }

	async execute(userId: string) {
		const sessions = await this.prisma.session.findMany({
			where: {
				AND: [
					{
						deletedAt: {
							isSet: false
						},
						userId
					},
					{
						OR: [
							{
								expiresAt: {
									gte: new Date()
								}
							},
							{
								expiresAt: null
							}
						]
					}
				]
			},
			select: sessionSelect,
			orderBy: {
				createdAt: 'desc'
			}
		})

		return sessions
	}
}
