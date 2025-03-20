import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class ContactExistsService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(key: string) {
    if (key === 'sample-key') return { exists: true };

    const contact = await this.prisma.contact.findFirst({
      where: { unsubscribeKey: key },
    });

    return { exists: !!contact };
  }
}
