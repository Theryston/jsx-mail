import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { PrismaService } from 'src/services/prisma.service';
import moment from 'moment';

@Injectable()
export class ImportFileDownloadsService {
	constructor(private readonly prisma: PrismaService) { }

	@Cron(CronExpression.EVERY_HOUR)
	async execute() {
		console.log(`[IMPORT_FILE_DOWNLOADS] started at: ${new Date()}`);
		const today = moment().format('MM-DD-YY');

		const { data } = await axios.get(`https://logging.bunnycdn.com/${today}/${process.env.BUNNY_CDN_ID}.log`, {
			responseType: 'text',
			headers: {
				'AccessKey': process.env.BUNNY_API_KEY,
			}
		})

		const lines = data.split('\n');

		for (const line of lines) {
			const elements = line.split('|');

			if (!elements.length || !elements[1] || !elements[2] || !elements[3] || !elements[7]) {
				continue;
			}

			const statusCode = Number(elements[1]);
			const timestamp = BigInt(elements[2]);
			const bytesSent = Number(elements[3]);
			const url = elements[7];

			if (statusCode !== 200 && statusCode !== 304) {
				continue;
			}

			const file = await this.prisma.file.findFirst({
				where: {
					url,
					deletedAt: {
						isSet: false,
					},
				},
			});

			if (!file) {
				continue;
			}

			const fileDownloadExists = await this.prisma.fileDownload.findFirst({
				where: {
					fileId: file.id,
					downloadedTime: {
						equals: timestamp,
					},
					deletedAt: {
						isSet: false,
					}
				},
			})

			if (fileDownloadExists) {
				console.log(`[IMPORT_FILE_DOWNLOADS] ${file.id} - ${bytesSent} - skip`);
				continue;
			}

			await this.prisma.fileDownload.create({
				data: {
					downloadedTime: timestamp,
					size: bytesSent,
					fileId: file.id,
					userId: file.userId,
				}
			})

			console.log(`[IMPORT_FILE_DOWNLOADS] ${file.id} - ${bytesSent} - created at: ${new Date()}`);
		}

		console.log(`[IMPORT_FILE_DOWNLOADS] ended at: ${new Date()}`);
	}
}
