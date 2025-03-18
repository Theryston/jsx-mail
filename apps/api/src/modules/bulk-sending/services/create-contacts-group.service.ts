import { Injectable } from '@nestjs/common';
import { CreateContactGroupDto } from '../bulk-sending.dto';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class CreateContactsGroupService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(body: CreateContactGroupDto, userId: string) {
    const contactGroup = await this.prisma.contactGroup.create({
      data: {
        name: body.name,
        userId,
      },
    });

    return contactGroup;
  }
}
