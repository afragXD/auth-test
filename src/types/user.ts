import { User } from 'prisma/__generated__';

// костыль для типизации getRequest()
export interface CustomRequest extends Request {
  user: User;
}
