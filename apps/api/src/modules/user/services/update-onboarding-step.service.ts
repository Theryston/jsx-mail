import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOnboardingDto } from '../user.dto';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class UpdateOnboardingStepService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(data: UpdateOnboardingDto, userId: string) {
    const user = await this.prisma.client.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.client.user.update({
      where: { id: userId },
      data: {
        onboardingStep: data.onboardingStep,
      },
    });

    return {
      message: 'Onboarding step updated',
    };
  }
}
