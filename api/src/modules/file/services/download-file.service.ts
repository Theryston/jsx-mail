import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { bandwidthToMoney, friendlyMoney } from 'src/utils/format-money';
import { GetBalanceService } from 'src/modules/user/services/get-balance.service';

@Injectable()
export class DownloadFileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly getBalanceService: GetBalanceService,
  ) {}

  async execute(key: string) {
    const file = await this.prisma.file.findFirst({
      where: {
        key,
        deletedAt: {
          isSet: false,
        },
      },
    });

    if (!file) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    const bandwidthPrice = bandwidthToMoney(file.size);

    const balance = await this.getBalanceService.execute(file.userId);

    if (balance.amount < bandwidthPrice) {
      throw new HttpException(
        `You need at least ${friendlyMoney(bandwidthPrice, true)} to download this file`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const client = new S3Client();

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.key,
    });

    const { Body } = await client.send(command);

    const arrayBytes = await Body.transformToByteArray();

    let buffer = Buffer.from(arrayBytes);

    await this.prisma.fileDownload.create({
      data: {
        size: file.size,
        fileId: file.id,
        userId: file.userId,
      },
    });

    return {
      buffer,
      mimeType: file.mimeType,
      filename: file.originalName,
    };
  }
}
