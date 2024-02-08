import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { transactionSelect } from 'src/utils/public-selects';

type ListTransactionsData = {
	take: number
	page: number
}

@Injectable()
export class ListTransactionsService {
	constructor(private readonly prisma: PrismaService) { }

	async execute({ take, page }: ListTransactionsData, userId: string) {
		if (take > 100) {
			take = 100
		}

		const skip = take * (page - 1);

		const transactions = await this.prisma.transaction.findMany({
			where: {
				userId,
				deletedAt: {
					isSet: false
				}
			},
			select: transactionSelect,
			skip,
			take,
			orderBy: {
				createdAt: 'desc'
			}
		})

		const count = await this.prisma.transaction.count({
			where: {
				userId,
				deletedAt: {
					isSet: false
				}
			}
		});

		return {
			transactions,
			totalPages: Math.ceil(count / take),
			total: count,
			hasNext: skip + take < count
		}
	}
}
