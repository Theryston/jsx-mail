import { Injectable } from '@nestjs/common';
import { CheckEmailDto } from '../user.dto';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { Inject } from '@nestjs/common';

@Injectable()
export class CheckEmailService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(data: CheckEmailDto) {
    const normalizedEmail = data.email.toLowerCase().trim();

    const user = await this.prisma.client.user.findUnique({
      where: { email: normalizedEmail },
    });

    return {
      exists: !!user,
    };
  }
}
