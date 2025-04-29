import { Inject, Injectable } from '@nestjs/common';
import { BouncedBy, MarkedBounceTo, PrismaClient } from '@prisma/client';
import moment from 'moment';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class MarkBounceToService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async create(email: string, bounceBy: BouncedBy): Promise<void> {
    const bounceToAlreadyExists = await this.get(email);

    if (bounceToAlreadyExists) return;

    const expiresAt = moment().add(30, 'days').toDate();

    await this.prisma.client.markedBounceTo.create({
      data: { email, bounceBy, expiresAt },
    });
  }

  async get(email: string): Promise<MarkedBounceTo | null> {
    const bounceTo = await this.prisma.client.markedBounceTo.findFirst({
      where: { email, expiresAt: { gte: new Date() } },
    });

    return bounceTo || null;
  }
}
