import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { S3ClientService } from './s3-client.service';

@Injectable()
export class DeleteFileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3ClientService: S3ClientService,
  ) {}

  async execute(fileId: string, userId: string) {
    const file = await this.prisma.file.findFirst({
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

    await this.prisma.file.delete({
      where: {
        id: fileId,
      },
    });

    return { message: 'File deleted successfully' };
  }
}
