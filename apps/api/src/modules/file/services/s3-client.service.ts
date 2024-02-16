import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3ClientService {
	private client: S3Client;

	constructor() {
		this.client = new S3Client({
			region: process.env.S3_REGION,
			endpoint: process.env.S3_ENDPOINT,
			credentials: {
				accessKeyId: process.env.S3_ACCESS_KEY_ID,
				secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
			},
		});
	}

	async putObject({ key, body, mimetype }: { key: string; body: Buffer; mimetype: string }) {
		const command = new PutObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: key,
			Body: body,
			ContentType: mimetype,
		})

		await this.client.send(command);

		const url = `${process.env.BASE_FILE_URL}/${key}`

		return url
	}

	async deleteObject(key: string) {
		const command = new DeleteObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: key,
		})

		await this.client.send(command);
	}
}
