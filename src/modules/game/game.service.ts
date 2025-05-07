import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Observable, BehaviorSubject } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateGameDto } from './dto/create-game.dto';
import { UserService } from '../user/user.service';
import { Game } from '@/types/game';
import { v4 as uuidv4 } from 'uuid';
import { GameStatus } from '@prisma/__generated__';
import { MAX_GAMES } from '@/constants/game';
import { hash } from 'argon2';

@Injectable()
export class GameService {
  private games: Map<string, Game> = new Map();
  private sseStreams: Map<string, BehaviorSubject<Game>> = new Map();

  constructor(
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createGame(userId: string, gameDto: CreateGameDto) {
    await this.userService.findById(userId);

    if (this.games.size >= MAX_GAMES) {
      throw new BadRequestException('Достигнут лимит активных игр');
    }

    for (const game of this.games.values()) {
      if (game.roomName === gameDto.roomName) {
        throw new BadRequestException('Комната с таким названием уже существует');
      }
    }

    const hashedPassword = gameDto.roomPassword ? await hash(gameDto.roomPassword) : null;

    const gameId = uuidv4();
    const game: Game = {
      id: gameId,
      roomName: gameDto.roomName,
      player1Id: userId,
      player2Id: null,
      status: GameStatus.PENDING,
      maxRounds: gameDto.maxRounds,
      initialTeamSize: gameDto.initialTeamSize,
      isRating: gameDto.isRating,
      isPrivate: gameDto.isPrivate,
      roomPassword: hashedPassword,
      gameBoard: [],
    };

    this.games.set(gameId, game);
    this.sseStreams.set(gameId, new BehaviorSubject<Game>(game));
    return game;
  }

  getGameStream(gameId: string): Observable<Game> {
    if (this.sseStreams.has(gameId)) {
      const stream = this.sseStreams.get(gameId)!;
      return stream.asObservable();
    }
    throw new NotFoundException();
  }

  completeGame(gameId: string): void {
    const stream = this.sseStreams.get(gameId);
    if (stream) {
      stream.complete();
      this.sseStreams.delete(gameId);
    }
    this.games.delete(gameId);
  }

  async getAvailableGames(userId: string): Promise<Game[]> {
    await this.userService.findById(userId);

    const availableGames: Game[] = [];

    for (const game of this.games.values()) {
      const isOpenGame = !game.isPrivate;
      const isUserParticipant = game.player1Id === userId || game.player2Id === userId;

      if (isOpenGame || isUserParticipant) {
        availableGames.push(game);
      }
    }

    return availableGames;
  }

  private emitGameUpdate(gameId: string, game: Game) {
    const stream = this.sseStreams.get(gameId);
    if (stream) {
      stream.next(game);
    } else {
      throw new NotFoundException();
    }
  }
}
