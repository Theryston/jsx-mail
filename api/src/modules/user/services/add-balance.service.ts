import { Injectable } from '@nestjs/common';
import { AddBalanceDto } from '../user.dto';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class AddBalanceService {
	constructor(private readonly prisma: PrismaService) { }

	async execute({ amount, userId, style, description }: AddBalanceDto) {
		await this.prisma.transaction.create({
			data: {
				amount: Math.round(amount),
				style,
				userId,
				description
			}
		})
	}
}
