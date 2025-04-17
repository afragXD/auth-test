import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { Request, Response } from 'express';
import { AppError } from '../../common/errors';
import { User } from 'prisma/__generated__';
import { LoginDto } from './dto/login.dto';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { ProviderService } from './provider/provider.service';
import { PrismaService } from '../prisma/prisma.service';
import { toUserResponceDto } from '@/utils/toUserResponceDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly providerService: ProviderService,
  ) {}

  async register(req: Request, dto: RegisterDto) {
    const isExists = await this.userService.findByEmail(dto.email);

    if (isExists) throw new ConflictException(AppError.USER_EXISTS);

    const newUser = await this.userService.create(dto.email, dto.password, dto.name, '', true);

    return this.saveSession(req, newUser);
  }

  async login(req: Request, dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user || !user.password) throw new NotFoundException(AppError.USER_DONT_EXIST);

    const isValidPassword = await verify(user.password, dto.password);

    if (!isValidPassword) throw new UnauthorizedException(AppError.INVALID_PASSWORD);

    return this.saveSession(req, user);
  }

  async extractProfileFromCode(req: Request, provider: string, code: string) {
    const providerInstance = this.providerService.findByService(provider);
    const profile = await providerInstance!.findUserByCode(code);

    const account = await this.prismaService.account.findFirst({
      where: {
        provider: profile.provider,
        user: {
          email: profile.email,
        },
      },
      include: {
        user: true,
      },
    });

    if (account?.user) {
      return this.saveSession(req, account.user);
    }

    const existingUser = await this.userService.findByEmail(profile.email);

    if (existingUser) {
      await this.prismaService.account.create({
        data: {
          userId: existingUser.id,
          type: 'oauth',
          provider: profile.provider,
          accessToken: profile.access_token,
          refreshToken: profile.refresh_token,
          expiresAt: profile.expires_at!,
        },
      });

      return this.saveSession(req, existingUser);
    }

    const newUser = await this.userService.create(
      profile.email,
      '',
      profile.name,
      profile.picture,
      true,
    );

    await this.prismaService.account.create({
      data: {
        userId: newUser.id,
        type: 'oauth',
        provider: profile.provider,
        accessToken: profile.access_token,
        refreshToken: profile.refresh_token,
        expiresAt: profile.expires_at!,
      },
    });

    return this.saveSession(req, newUser);
  }

  async logout(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((error) => {
        if (error) {
          return reject(
            new InternalServerErrorException(
              'Не удалось завершить сессию. Возможно, возникла проблема с сервером или сессия уже была завершена.',
            ),
          );
        }
        res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));
        resolve();
      });
    });
  }

  private async saveSession(req: Request, user: User) {
    return new Promise((resolve, reject) => {
      req.session.userId = user.id;

      req.session.save((error) => {
        if (error) {
          return reject(new InternalServerErrorException('Не удалось сохранить сессию.'));
        }
        resolve({ user: toUserResponceDto(user) });
      });
    });
  }
}
