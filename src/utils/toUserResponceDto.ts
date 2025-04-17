import { UserResponseDto } from '@/modules/auth/dto/responce.dto';
import { User } from '@prisma/__generated__';

export const toUserResponceDto = (user: User): UserResponseDto => {
  const userResponse: UserResponseDto = {
    id: user.id,
    displayName: user.displayName,
    email: user.email,
    picture: user.picture,
    role: user.role,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
  return userResponse;
};
