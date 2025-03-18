import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DeleteSessionDto } from '../session.dto';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class DeleteSessionService {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ sessionId }: DeleteSessionDto) {
    if (!sessionId) {
      throw new HttpException('Session ID is required', HttpStatus.BAD_REQUEST);
    }

    const session = await this.prisma.session.findFirst({
      where: {
        id: sessionId,
        deletedAt: null,
      },
    });

    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.session.delete({
      where: {
        id: sessionId,
      },
    });

    return { message: 'Session deleted' };
  }
}
