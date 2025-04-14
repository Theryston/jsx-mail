import { Injectable } from '@nestjs/common';
import { CheckEmailDto } from '../user.dto';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class CheckEmailService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(data: CheckEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    return {
      exists: !!user,
    };
  }
}
