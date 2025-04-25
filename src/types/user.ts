import { User, UserRating } from 'prisma/__generated__';

export type RelationsUser = User & { rating: UserRating | null };

// костыль для типизации getRequest()
export interface CustomRequest extends Request {
  user: User;
}
