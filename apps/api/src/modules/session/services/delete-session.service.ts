import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DeleteSessionDto } from '../session.dto';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { Inject } from '@nestjs/common';

@Injectable()
export class DeleteSessionService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute({ sessionId }: DeleteSessionDto) {
    if (!sessionId) {
      throw new HttpException('Session ID is required', HttpStatus.BAD_REQUEST);
    }

    const session = await this.prisma.client.session.findFirst({
      where: {
        id: sessionId,
        deletedAt: null,
      },
    });

    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.client.session.delete({
      where: {
        id: sessionId,
      },
    });

    return { message: 'Session deleted' };
  }
}
