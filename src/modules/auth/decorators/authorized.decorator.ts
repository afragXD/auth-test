import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'prisma/__generated__';
import { CustomRequest } from '../../../types/user';

export const Authorized = createParamDecorator((data: keyof User, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<CustomRequest>();
  const user = request.user;

  return data ? user[data] : user;
});
