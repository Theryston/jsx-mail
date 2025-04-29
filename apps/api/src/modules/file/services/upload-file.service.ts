import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import calculateHash from 'src/utils/calculate-hash';
import { fileSelect } from 'src/utils/public-selects';
import { S3ClientService } from './s3-client.service';
import { formatSize } from 'src/utils/format';
import { GetSettingsService } from 'src/modules/user/services/get-settings.service';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class UploadFileService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    private readonly s3ClientService: S3ClientService,
    private readonly getSettingsService: GetSettingsService,
  ) {}

  async execute(file: Express.Multer.File, userId: string) {
    if (!file.originalname) {
      throw new HttpException('File name is required', HttpStatus.BAD_REQUEST);
    }

    if (!file.buffer) {
      throw new HttpException(
        'File buffer is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!file.mimetype) {
      throw new HttpException(
        'File mimetype is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.prisma.client.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const settings = await this.getSettingsService.execute(userId);

    if (file.size > settings.maxFileSize) {
      throw new HttpException('File size is too large', HttpStatus.BAD_REQUEST);
    }

    const {
      _sum: { size: storage },
    } = await this.prisma.client.file.aggregate({
      where: {
        deletedAt: null,
        userId,
      },
      _sum: {
        size: true,
      },
    });

    if (storage + file.size > settings.maxStorage) {
      throw new HttpException(
        `You have reached the maximum storage limit of ${formatSize(settings.maxStorage)}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const hash = calculateHash(file.buffer);

    const fileAlreadyExists = await this.prisma.client.file.findFirst({
      where: {
        hash,
        userId: user.id,
        deletedAt: null,
      },
      select: fileSelect,
    });

    if (fileAlreadyExists) {
      return fileAlreadyExists;
    }

    let ext =
      file.originalname.split('.').length > 1
        ? file.originalname.split('.').pop()
        : undefined;

    const key = `${user.id}/${new Date().getTime()}.${ext ? ext : file.mimetype.split('/')[1]}`;

    const url = await this.s3ClientService.putObject({
      key,
      body: file.buffer,
      mimetype: file.mimetype,
    });

    const createdFile = await this.prisma.client.file.create({
      data: {
        encoding: file.encoding,
        key,
        mimeType: file.mimetype,
        originalName: file.originalname,
        size: file.size,
        userId: user.id,
        hash,
        url,
      },
      select: fileSelect,
    });

    return createdFile;
  }
}
