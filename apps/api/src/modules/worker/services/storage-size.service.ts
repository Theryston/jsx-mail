import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/services/prisma.service';
import moment from 'moment';

@Injectable()
export class StorageSizeService {
	constructor(private readonly prisma: PrismaService) { }


	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async execute() {
		console.log(`[STORAGE-SIZE] started at: ${new Date()}`);
		const filesUsers = await this.prisma.file.groupBy({
			where: {
				deletedAt: {
					isSet: false,
				},
			},
			by: ['userId'],
			_sum: {
				size: true,
			},
		});

		for (const {
			userId,
			_sum: { size },
		} of filesUsers) {
			const today = moment().set({
				hour: 0,
				minute: 0,
				second: 0,
				milliseconds: 0,
			});

			const hasStorage = await this.prisma.storageSize.findFirst({
				where: {
					userId,
					createdAt: {
						gt: today.toDate(),
					},
				},
			});

			if (hasStorage) {
				console.log(`[STORAGE-SIZE] ${userId} - ${size} - skip`);
				continue;
			}

			const lastMonthDay = moment().endOf('month').set({
				hour: 0,
				minute: 0,
				second: 0,
				milliseconds: 0,
			});

			await this.prisma.storageSize.create({
				data: {
					userId,
					size,
					chargeAt: lastMonthDay.toDate(),
				},
			});

			console.log(`[STORAGE-SIZE] ${userId} - ${size}`);
		}

		console.log(`[STORAGE-SIZE] ended at: ${new Date()}`);
	}
}
