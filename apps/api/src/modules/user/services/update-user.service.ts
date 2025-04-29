import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../user.dto';
import moment from 'moment';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class UpdateUserService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute({
    name,
    userId,
    birthdate,
    phone,
  }: UpdateUserDto & { userId: string }) {
    const birthdateMoment = birthdate ? moment(birthdate) : null;

    if (birthdateMoment && !birthdateMoment.isValid())
      throw new HttpException('Invalid birthdate', HttpStatus.BAD_REQUEST);

    const eighteenYearsAgo = moment().subtract(18, 'years');
    if (birthdateMoment && birthdateMoment.isAfter(eighteenYearsAgo))
      throw new HttpException(
        'User must be at least 18 years old',
        HttpStatus.BAD_REQUEST,
      );

    const user = await this.prisma.client.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        phone,
        birthdate,
      },
    });

    return user;
  }
}
