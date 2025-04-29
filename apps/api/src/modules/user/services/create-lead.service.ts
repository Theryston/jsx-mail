import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateLeadDto } from '../user.dto';
import { CheckEmailService } from './check-email.service';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { Inject } from '@nestjs/common';

@Injectable()
export class CreateLeadService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    private readonly checkEmailService: CheckEmailService,
  ) {}

  async execute({ email, name, phone }: CreateLeadDto) {
    const { exists } = await this.checkEmailService.execute({ email });

    if (exists) {
      throw new BadRequestException('Email already in use');
    }

    const lead = await this.prisma.client.lead.create({
      data: {
        email,
        name,
        phone,
      },
    });

    return { id: lead.id };
  }
}
