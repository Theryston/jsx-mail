import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user.dto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class CreateUserService {
  constructor(private readonly prisma: PrismaService) {}

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
      throw new HttpException(
        'Fingerprint is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!ipAddress) {
      throw new HttpException('IP address is required', HttpStatus.BAD_REQUEST);
    }

    const blockedIpAddress = await this.prisma.blockedIpAddress.findFirst({
      where: {
        ipAddress,
      },
    });

    if (blockedIpAddress) {
      throw new HttpException('IP address is blocked', HttpStatus.BAD_REQUEST);
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

    const fingerprintExists = await this.prisma.user.findFirst({
      where: {
        fingerprint,
        deletedAt: null,
      },
    });

    if (fingerprintExists) {
      const secretEmail = fingerprintExists.email.replace(
        /(.{2})(.*)(.{2}@.*)/,
        '$1***$3',
      );
      throw new HttpException(
        `The account ${secretEmail} is already registered with this device. You can login with the email ${secretEmail}`,
        HttpStatus.BAD_REQUEST,
      );
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
