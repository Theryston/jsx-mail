import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { messageSelect } from 'src/utils/public-selects';

@Injectable()
export class GetMessageService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id, userId },
      select: {
        ...messageSelect,
        body: true,
        sender: {
          select: {
            email: true,
            name: true,
          },
        },
        statusHistory: {
          select: {
            id: true,
            createdAt: true,
            description: true,
            status: true,
            extras: {
              select: {
                key: true,
                value: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return message;
  }
}
