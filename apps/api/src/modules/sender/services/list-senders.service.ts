import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { senderSelect } from 'src/utils/public-selects';

@Injectable()
export class ListSendersService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    return this.prisma.sender.findMany({
      where: {
        userId,
        deletedAt: {
          isSet: false,
        },
      },
      select: senderSelect,
    });
  }
}
