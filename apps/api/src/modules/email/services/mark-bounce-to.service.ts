import { Injectable } from '@nestjs/common';
import { BouncedBy, MarkedBounceTo } from '@prisma/client';
import { PrismaService } from 'src/services/prisma.service';
import moment from 'moment';

@Injectable()
export class MarkBounceToService {
  constructor(private prisma: PrismaService) {}

  async create(email: string, bounceBy: BouncedBy): Promise<void> {
    const bounceToAlreadyExists = await this.get(email);

    if (bounceToAlreadyExists) return;

    const expiresAt = moment().add(30, 'days').toDate();

    await this.prisma.markedBounceTo.create({
      data: { email, bounceBy, expiresAt },
    });
  }

  async get(email: string): Promise<MarkedBounceTo | null> {
    const bounceTo = await this.prisma.markedBounceTo.findFirst({
      where: { email, expiresAt: { gte: new Date() } },
    });

    return bounceTo || null;
  }
}
