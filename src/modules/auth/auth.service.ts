import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { Request, Response } from 'express';
import { AppError } from '../../common/errors';
import { AuthMethod, User } from 'prisma/__generated__';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(req: Request, dto: RegisterDto) {
    const isExists = await this.userService.findByEmail(dto.email);

    if (isExists) {
      throw new ConflictException(AppError.USER_EXISTS);
    }

    const newUser = await this.userService.create(
      dto.email,
      dto.password,
      dto.name,
      '',
      AuthMethod.CREDENTIALS,
      false,
    );

    return this.saveSession(req, newUser);
  }

  async login() {}

  async logout() {}

  private async saveSession(req: Request, user: User) {
    return new Promise((resolve, reject) => {
      req.session.userId = user.id;

      req.session.save((error) => {
        if (error) {
          return reject(new InternalServerErrorException('Не удалось сохранить сессию.'));
        }
        resolve({ user });
      });
    });
  }
}
