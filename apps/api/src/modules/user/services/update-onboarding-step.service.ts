import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOnboardingDto } from '../user.dto';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class UpdateOnboardingStepService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(data: UpdateOnboardingDto, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
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
