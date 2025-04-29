import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { S3ClientService } from './s3-client.service';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class DeleteFileService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    private readonly s3ClientService: S3ClientService,
  ) {}

  async execute(fileId: string, userId: string) {
    const file = await this.prisma.client.file.findFirst({
      where: {
        id: fileId,
        userId: userId,
        deletedAt: null,
      },
    });

    if (!file) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    await this.s3ClientService.deleteObject(file.key);

    await this.prisma.client.file.delete({
      where: {
        id: fileId,
      },
    });

    return { message: 'File deleted successfully' };
  }
}
