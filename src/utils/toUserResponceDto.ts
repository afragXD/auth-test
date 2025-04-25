import { UserResponseDto } from '@/modules/auth/dto/responce.dto';
import { RelationsUser } from '@/types/user';
import { getArenaRank } from './getArenaRank';

export const toUserResponceDto = (user: RelationsUser): UserResponseDto => {
  const userResponse: UserResponseDto = {
    id: user.id,
    displayName: user.displayName,
    email: user.email,
    picture: user.picture,
    role: user.role,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    rating: user.rating ? { ...user.rating, rank: getArenaRank(user.rating.rating) } : null,
  };
  return userResponse;
};
