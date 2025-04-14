import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from '../../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private readonly userServuce: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    if (typeof request.session.userId === 'undefined')
      throw new UnauthorizedException('Пользователь не авторизован.');

    const user = await this.userServuce.findById(request.session.userId);

    request.user = user;

    return true;
  }
}
