import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateGameDto } from './dto/create-game.dto';
import { UserService } from '../user/user.service';
import { Game } from '@/types/game';
import { v4 as uuidv4 } from 'uuid';
import { GameStatus } from '@prisma/__generated__';

@Injectable()
export class GameService {
  private sseStreams: Map<string, Subject<Game>> = new Map();

  constructor(
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createGame(userId: string, gameDto: CreateGameDto) {
    const user = await this.userService.findById(userId);

    const gameId = uuidv4();
    const game: Game = {
      roomName: gameDto.roomName,
      player1Id: userId,
      player2Id: null,
      status: GameStatus.PENDING,
      maxRounds: gameDto.maxRounds,
      initialTeamSize: gameDto.initialTeamSize,
      isRating: gameDto.isRating,
      isPrivate: gameDto.isPrivate,
      roomPassword: gameDto.roomPassword ?? null,
      gayBoard: [],
    };

    this.sseStreams.set(gameId, new Subject<Game>());
    this.emitGameUpdate(gameId, game);
    return { id: gameId, ...game };
  }

  getGameStream(gameId: string): Observable<Game> {
    if (this.sseStreams.has(gameId)) {
      return this.sseStreams.get(gameId)!.asObservable();
    }
    throw new NotFoundException();
  }

  private async emitGameUpdate(gameId: string, game: Game) {
    const stream = this.sseStreams.get(gameId);
    if (stream) {
      stream.next(game);
    } else {
      throw new NotFoundException();
    }
  }
}
