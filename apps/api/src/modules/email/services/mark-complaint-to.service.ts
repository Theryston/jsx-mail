import { Inject, Injectable } from '@nestjs/common';
import { MarkedComplaintTo, PrismaClient } from '@prisma/client';
import moment from 'moment';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class MarkComplaintToService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async create(email: string, userId: string): Promise<void> {
    const complaintToAlreadyExists = await this.get(email, userId);

    if (complaintToAlreadyExists) return;

    const expiresAt = moment().add(30, 'days').toDate();

    await this.prisma.client.markedComplaintTo.create({
      data: { email, userId, expiresAt },
    });
  }

  async get(email: string, userId: string): Promise<MarkedComplaintTo | null> {
    const complaintTo = await this.prisma.client.markedComplaintTo.findFirst({
      where: {
        email,
        userId,
        expiresAt: { gte: new Date() },
      },
    });

    return complaintTo || null;
  }
}
