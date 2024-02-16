import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import calculateHash from 'src/utils/calculate-hash';
import { MAX_FILE_SIZE } from 'src/utils/contants';
import { fileSelect } from 'src/utils/public-selects';
import { GetBalanceService } from 'src/modules/user/services/get-balance.service';
import { friendlyMoney, storageToMoney } from 'src/utils/format-money';
import { S3ClientService } from './s3-client.service';

@Injectable()
export class UploadFileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly getBalanceService: GetBalanceService,
    private readonly s3ClientService: S3ClientService
  ) { }

  async execute(file: Express.Multer.File, userId: string) {
    if (!file.originalname) {
      throw new HttpException('File name is required', HttpStatus.BAD_REQUEST);
    }

    if (!file.buffer) {
      throw new HttpException('File buffer is required', HttpStatus.BAD_REQUEST);
    }

    if (!file.mimetype) {
      throw new HttpException('File mimetype is required', HttpStatus.BAD_REQUEST);
    }

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

    if (file.size > MAX_FILE_SIZE) {
      throw new HttpException('File size is too large', HttpStatus.BAD_REQUEST);
    }

    const storagePrice = storageToMoney(file.size);

    const balance = await this.getBalanceService.execute(user.id);

    if (balance.amount < storagePrice) {
      throw new HttpException(
        `You need at least ${friendlyMoney(storagePrice, true)} to upload this file`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const hash = calculateHash(file.buffer);

    const fileAlreadyExists = await this.prisma.file.findFirst({
      where: {
        hash,
        userId: user.id,
        deletedAt: {
          isSet: false,
        },
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
    })

    const createdFile = await this.prisma.file.create({
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
