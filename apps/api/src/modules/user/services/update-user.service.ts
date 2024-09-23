import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../user.dto';
import { PrismaService } from 'src/services/prisma.service';
import moment from 'moment';

@Injectable()
export class UpdateUserService {
  constructor(private readonly prisma: PrismaService) {}

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

    const user = await this.prisma.user.update({
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
