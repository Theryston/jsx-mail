import { Injectable } from '@nestjs/common';
import { AddBalanceDto } from '../user.dto';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { Inject } from '@nestjs/common';

@Injectable()
export class AddBalanceService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute({ amount, userId, style, description }: AddBalanceDto) {
    await this.prisma.client.transaction.create({
      data: {
        amount: Math.round(amount),
        style,
        userId,
        description,
      },
    });
  }
}
