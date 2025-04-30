import { GameStatus } from '@prisma/__generated__';

export interface Game {
  displayName: string;
  player1Id: string;
  player2Id?: string;
  status: GameStatus;
  maxRounds: number;
  initialTeamSize: number;
  // TODO: добавить потом
  // isRating: boolean;
  // isPrivate: boolean;
}
