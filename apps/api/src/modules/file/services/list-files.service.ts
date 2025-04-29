import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { fileSelect } from 'src/utils/public-selects';
import { CustomPrismaService } from 'nestjs-prisma';

type ListFilesData = {
  take: number;
  page: number;
};

@Injectable()
export class ListFilesService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute({ take, page }: ListFilesData, userId: string) {
    const skip = take * (page - 1);

    const files = await this.prisma.client.file.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      select: fileSelect,
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const count = await this.prisma.client.file.count({
      where: {
        userId,
        deletedAt: null,
      },
    });

    return {
      files,
      totalPages: Math.ceil(count / take),
      total: count,
      hasNext: skip + take < count,
    };
  }
}
