import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class ListContactGroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    return this.prisma.contactGroup.findMany({ where: { userId } });
  }
}
