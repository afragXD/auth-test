import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from 'prisma/__generated__';
import { Roles } from './roles.decorators';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export const Authorization = (...roles: UserRole[]) => {
  if (roles.length > 0) {
    return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard));
  }

  return applyDecorators(UseGuards(AuthGuard));
};
