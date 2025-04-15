import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppError } from '../../common/errors';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  public constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      throw new NotFoundException(AppError.USER_DONT_EXIST);
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        accounts: true,
      },
    });

    return user;
  }

  async create(
    email: string,
    password: string,
    displayName: string,
    picture: string,
    isVerified: boolean,
  ) {
    const user = await this.prismaService.user.create({
      data: {
        email,
        password: password ? await hash(password) : null,
        displayName,
        picture,
        isVerified,
      },
      include: {
        accounts: true,
      },
    });

    return user;
  }
}
