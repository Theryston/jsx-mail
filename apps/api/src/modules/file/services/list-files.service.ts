import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { fileSelect } from 'src/utils/public-selects';

type ListFilesData = {
  take: number;
  page: number;
};

@Injectable()
export class ListFilesService {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ take, page }: ListFilesData, userId: string) {
    const skip = take * (page - 1);

    const files = await this.prisma.file.findMany({
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

    const count = await this.prisma.file.count({
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
