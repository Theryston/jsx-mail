import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class ContactExistsService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(key: string) {
    if (key === 'sample-key') return { exists: true };

    const contact = await this.prisma.client.contact.findFirst({
      where: { unsubscribeKey: key },
    });

    return { exists: !!contact };
  }
}
