import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import calculateHash from 'src/utils/calculate-hash';
import { MAX_FILE_SIZE } from 'src/utils/contants';
import { fileSelect } from 'src/utils/public-selects';
import { GetBalanceService } from 'src/modules/user/services/get-balance.service';
import { friendlyMoney, storageToMoney } from 'src/utils/format-money';
import B2 from 'backblaze-b2';

@Injectable()
export class UploadFileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly getBalanceService: GetBalanceService,
  ) { }

  async execute(file: Express.Multer.File, userId: string) {
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

    if (!file.originalname) {
      file.originalname = hash;
    }

    let ext =
      file.originalname.split('.').length > 1
        ? file.originalname.split('.').pop()
        : undefined;
    const key = `${user.id}/${hash}${ext ? `.${ext}` : ''}`;

    const b2 = new B2({
      applicationKeyId: process.env.BACKBLAZE_APPLICATION_KEY_ID,
      applicationKey: process.env.BACKBLAZE_APPLICATION_KEY,
    });

    await b2.authorize();

    const { data: { authorizationToken, uploadUrl } } = await b2.getUploadUrl({
      bucketId: process.env.BACKBLAZE_BUCKET_ID,
    })

    const { data } = await b2.uploadFile({
      uploadUrl,
      uploadAuthToken: authorizationToken,
      fileName: key,
      data: file.buffer,
    })

    const url = `${process.env.BASE_FILE_URL}/${key}`;

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
        externalId: data.fileId,
      },
      select: fileSelect,
    });

    return createdFile;
  }
}
