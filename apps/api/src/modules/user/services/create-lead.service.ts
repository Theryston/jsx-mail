import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateLeadDto } from '../user.dto';
import { PrismaService } from 'src/services/prisma.service';
import { CheckEmailService } from './check-email.service';

@Injectable()
export class CreateLeadService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly checkEmailService: CheckEmailService,
  ) {}

  async execute({ email, name, phone }: CreateLeadDto) {
    const { exists } = await this.checkEmailService.execute({ email });

    if (exists) {
      throw new BadRequestException('Email already in use');
    }

    const lead = await this.prisma.lead.create({
      data: {
        email,
        name,
        phone,
      },
    });

    return { id: lead.id };
  }
}
