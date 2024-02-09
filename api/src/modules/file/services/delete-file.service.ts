import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class DeleteFileService {
	constructor(private readonly prisma: PrismaService) { }

	async execute(fileId: string, userId: string) {
		const user = await this.prisma.user.findFirst({
			where: {
				id: userId,
				deletedAt: {
					isSet: false
				}
			}
		})

		if (!user) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND)
		}

		const file = await this.prisma.file.findFirst({
			where: {
				id: fileId,
				userId: user.id,
				deletedAt: {
					isSet: false
				}
			}
		})

		if (!file) {
			throw new HttpException('File not found', HttpStatus.NOT_FOUND)
		}

		const client = new S3Client();

		const command = new DeleteObjectCommand({
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: file.key
		})

		await client.send(command);

		await this.prisma.file.update({
			where: {
				id: fileId
			},
			data: {
				deletedAt: new Date()
			}
		})

		return { message: 'File deleted successfully' }
	}
}
