import { UserRating } from '@prisma/__generated__';

interface Rank {
  label: string;
  slug: string;
}

export interface UserResponseDto {
  id: string;
  displayName: string;
  email: string;
  picture: string | null;
  role: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  rating: (UserRating & { rank: Rank }) | null;
}
