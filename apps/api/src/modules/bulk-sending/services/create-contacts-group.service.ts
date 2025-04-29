import { Inject, Injectable } from '@nestjs/common';
import { CreateContactGroupDto } from '../bulk-sending.dto';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class CreateContactsGroupService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(body: CreateContactGroupDto, userId: string) {
    const contactGroup = await this.prisma.client.contactGroup.create({
      data: {
        name: body.name,
        userId,
      },
    });

    return contactGroup;
  }
}
