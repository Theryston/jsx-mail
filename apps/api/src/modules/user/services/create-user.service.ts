import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user.dto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/services/prisma.service';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class CreateUserService {
  ipHubClient: AxiosInstance;

  constructor(private readonly prisma: PrismaService) {
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
  }: CreateUserDto & { fingerprint: string; ipAddress: string }) {
    email = email.toLocaleLowerCase().trim();
    name = name.toLocaleLowerCase().trim();

    if (!fingerprint) {
      throw new HttpException('Something is wrong', HttpStatus.BAD_REQUEST);
    }

    if (!ipAddress) {
      throw new HttpException('Something is wrong', HttpStatus.BAD_REQUEST);
    }

    const blockedIpAddress = await this.prisma.blockedIpAddress.findFirst({
      where: {
        ipAddress,
      },
    });

    if (blockedIpAddress) {
      throw new HttpException('Something is wrong', HttpStatus.BAD_REQUEST);
    }

    const fingerprintExists = await this.prisma.user.findFirst({
      where: {
        fingerprint,
        deletedAt: null,
      },
    });

    if (fingerprintExists) {
      throw new HttpException('Something is wrong', HttpStatus.BAD_REQUEST);
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
      },
    });

    delete user.password;
    delete user.deletedAt;

    return {
      message: 'User created successfully',
      user,
    };
  }
}
