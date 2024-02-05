import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import calculateHash from 'src/utils/calculate-hash';
import { MAX_FILE_SIZE } from 'src/utils/contants';
import { fileSelect } from 'src/utils/public-selects';
import { CustomFile } from 'src/interceptors/file.interceptor';

@Injectable()
export class UploadFileService {
	constructor(private readonly prisma: PrismaService) { }

	async execute(file: CustomFile, userId: string) {
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

		if (file.size > MAX_FILE_SIZE) {
			throw new HttpException('File size is too large', HttpStatus.BAD_REQUEST)
		}

		const hash = calculateHash(file.buffer);

		const fileAlreadyExists = await this.prisma.file.findFirst({
			where: {
				hash,
				userId: user.id,
				deletedAt: {
					isSet: false
				}
			},
			select: fileSelect
		})

		if (fileAlreadyExists) {
			return fileAlreadyExists
		}

		const ext = file.originalname.split('.').pop();
		const key = `${user.id}/${hash}.${ext}`

		const client = new S3Client();

		const command = new PutObjectCommand({
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: key,
			Body: file.buffer,
			ContentType: file.mimetype
		})

		await client.send(command);

		const createdFile = await this.prisma.file.create({
			data: {
				encoding: file.encoding,
				key,
				mimeType: file.mimetype,
				originalName: file.originalname,
				size: file.size,
				userId: user.id,
				hash
			},
			select: fileSelect
		})

		return createdFile
	}
}
