import { GameStatus } from '@prisma/__generated__';

export interface Game {
  id: string;
  roomName: string;
  player1Id: string;
  player2Id: string | null;
  status: GameStatus;
  maxRounds: number;
  initialTeamSize: number;
  isRating: boolean;
  isPrivate: boolean;
  roomPassword: string | null;

  gameBoard: any[];
}

export interface GameWithId extends Game {
  id: string;
}
