import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user.dto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/services/prisma.service';
import axios, { AxiosInstance } from 'axios';
import { VerifyTurnstileService } from './verify-turnstile.service';
@Injectable()
export class CreateUserService {
  ipHubClient: AxiosInstance;

  constructor(
    private readonly prisma: PrismaService,
    private readonly verifyTurnstileService: VerifyTurnstileService,
  ) {
    this.ipHubClient = axios.create({
      baseURL: 'http://v2.api.iphub.info',
      headers: {
        'X-Key': process.env.IP_HUB_API_KEY,
      },
    });
  }
  async execute({
    email,
    password,
    name,
    fingerprint,
    ipAddress,
    turnstileToken,
    utmGroupId,
    phone,
  }: CreateUserDto & { fingerprint: string; ipAddress: string }) {
    email = email.toLocaleLowerCase().trim();
    name = name.toLocaleLowerCase().trim();

    await this.verifyTurnstileService.execute(turnstileToken);

    if (ipAddress) {
      const blockedIpAddress = await this.prisma.blockedIpAddress.findFirst({
        where: {
          ipAddress,
        },
      });

      if (blockedIpAddress) {
        throw new HttpException(
          'You was blocked by our system, please contact support',
          HttpStatus.BAD_REQUEST,
        );
      }

      const { data: ipHubResponse } = await this.ipHubClient.get(
        `/ip/${ipAddress}`,
      );

      if (ipHubResponse.block === 1) {
        throw new HttpException(
          'Seems you are using a proxy, please turn off and try again',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const userExists = await this.prisma.user.findFirst({
      where: {
        email: email,
        deletedAt: null,
      },
    });

    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashPassword,
        fingerprint,
        ipAddress,
        phone,
      },
    });

    delete user.password;
    delete user.deletedAt;

    if (utmGroupId) {
      await this.prisma.userUtmGroup.update({
        where: {
          id: utmGroupId,
        },
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      await this.prisma.userUtm.updateMany({
        where: {
          groupId: utmGroupId,
        },
        data: {
          userId: user.id,
        },
      });
    }

    return {
      message: 'User created successfully',
      user,
    };
  }
}
