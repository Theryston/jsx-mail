import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { SendEmailService } from 'src/modules/email/services/send-email.service';
import { CreateSecurityCodeDto } from '../user.dto';
import { render as jsxMailRender } from 'jsx-mail';

@Injectable()
export class CreateSecurityCodeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sendEmailService: SendEmailService,
  ) {}

  async execute(data: CreateSecurityCodeDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: data.email,
        deletedAt: null,
      },
    });

    if (!user) {
      const randomTime = Math.floor(300 + Math.random() * 2000);
      await new Promise((resolve) => setTimeout(resolve, randomTime)); // Delay the response to avoid timing attacks

      return {
        message: 'Security code sent successfully',
      };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(new Date().getTime() + 1000 * 60 * 5); // 5 minutes

    await this.prisma.securityCode.create({
      data: {
        userId: user.id,
        code,
        expiresAt,
      },
    });

    const htmlCode = await jsxMailRender('user:security-code', {
      code,
      expiresAt,
    });

    await this.sendEmailService.execute({
      from: {
        name: 'JSX Mail Cloud',
        email: `jsxmail@${process.env.DEFAULT_EMAIL_DOMAIN_NAME}`,
      },
      to: [user.email],
      subject: 'Your security code',
      html: htmlCode,
    });

    return {
      message: 'Security code sent successfully',
    };
  }
}
