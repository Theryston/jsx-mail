import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import B2 from 'backblaze-b2';

@Injectable()
export class DeleteFileService {
  constructor(private readonly prisma: PrismaService) { }

  async execute(fileId: string, userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: {
          isSet: false,
        },
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const file = await this.prisma.file.findFirst({
      where: {
        id: fileId,
        userId: user.id,
        deletedAt: {
          isSet: false,
        },
      },
    });

    if (!file) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    if (file.externalId) {
      const b2 = new B2({
        applicationKeyId: process.env.BACKBLAZE_APPLICATION_KEY_ID,
        applicationKey: process.env.BACKBLAZE_APPLICATION_KEY,
      });

      await b2.authorize();

      await b2.deleteFileVersion({
        fileName: file.key,
        fileId: file.externalId,
      })
    }

    await this.prisma.file.update({
      where: {
        id: fileId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return { message: 'File deleted successfully' };
  }
}
