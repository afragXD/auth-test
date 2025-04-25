/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, Subject } from 'rxjs';
import { GameStatus, Prisma } from '@prisma/__generated__';

type GameWithRelations = Prisma.GameGetPayload<{
  include: { player1: true; player2: true; spectators: true };
}>;

@Injectable()
export class GameService {
  private sseStreams: Map<string, Subject<any>> = new Map();

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createGame(userId: string): Promise<GameWithRelations> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const game = await this.prisma.game.create({
      data: {
        player1Id: userId,
        status: GameStatus.PENDING,
        board: [
          [null, null, null],
          [null, null, null],
          [null, null, null],
        ], // JSON object
      },
      include: { player1: true, player2: true, spectators: true },
    });

    this.sseStreams.set(game.id, new Subject<any>());
    this.emitGameUpdate(game.id, game);
    return game;
  }

  async joinGame(gameId: string, userId: string): Promise<GameWithRelations> {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      include: { player1: true, player2: true, spectators: true },
    });
    if (!game) throw new NotFoundException('Game not found');
    if (game.status !== GameStatus.PENDING) throw new BadRequestException('Game is not joinable');
    if (game.player1Id === userId) throw new BadRequestException('Cannot join own game');

    const updatedGame = await this.prisma.game.update({
      where: { id: gameId },
      data: {
        player2Id: userId,
        status: GameStatus.ACTIVE,
        currentTurn: game.player1Id,
      },
      include: { player1: true, player2: true, spectators: true },
    });

    this.emitGameUpdate(gameId, updatedGame);
    return updatedGame;
  }

  async joinAsSpectator(gameId: string, userId: string): Promise<GameWithRelations> {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      include: { player1: true, player2: true, spectators: true },
    });
    if (!game) throw new NotFoundException('Game not found');
    if (game.player1Id === userId || game.player2Id === userId) {
      throw new BadRequestException('Players cannot be spectators');
    }
    if (game.spectators.some((s) => s.id === userId)) {
      throw new BadRequestException('Already a spectator');
    }

    const updatedGame = await this.prisma.game.update({
      where: { id: gameId },
      data: {
        spectators: { connect: { id: userId } },
      },
      include: { player1: true, player2: true, spectators: true },
    });

    this.emitGameUpdate(gameId, updatedGame);
    return updatedGame;
  }

  async makeMove(
    gameId: string,
    userId: string,
    row: number,
    col: number,
  ): Promise<GameWithRelations> {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      include: { player1: true, player2: true, spectators: true },
    });
    if (!game) throw new NotFoundException('Game not found');
    if (game.status !== GameStatus.ACTIVE) throw new BadRequestException('Game is not active');
    if (game.currentTurn !== userId) throw new BadRequestException('Not your turn');
    if (userId !== game.player1Id && userId !== game.player2Id) {
      throw new BadRequestException('Not a player');
    }

    const board = game.board as any[][]; // Board is a JSON object
    if (row < 0 || row > 2 || col < 0 || col > 2 || board[row][col] !== null) {
      throw new BadRequestException('Invalid move');
    }

    const symbol = userId === game.player1Id ? 'X' : 'O';
    board[row][col] = symbol;

    const winnerSymbol = this.checkWinner(board);
    const isDraw =
      !winnerSymbol && board.every((row: any[]) => row.every((cell: any) => cell !== null));
    const winner = winnerSymbol ? (winnerSymbol === 'X' ? game.player1Id : game.player2Id) : null;

    const updatedGame = await this.prisma.game.update({
      where: { id: gameId },
      data: {
        board, // Save as JSON object
        currentTurn: userId === game.player1Id ? game.player2Id : game.player1Id,
        status: winner || isDraw ? GameStatus.COMPLETED : GameStatus.ACTIVE,
        winner,
      },
      include: { player1: true, player2: true, spectators: true },
    });

    if (winner || isDraw) {
      await this.updateRatings(updatedGame);
    }

    this.emitGameUpdate(gameId, updatedGame);
    return updatedGame;
  }

  private checkWinner(board: any[][]): string | null {
    for (let i = 0; i < 3; i++) {
      if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2])
        return board[i][0];
      if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i])
        return board[0][i];
    }
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2])
      return board[0][0];
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0])
      return board[0][2];
    return null;
  }

  private async updateRatings(game: GameWithRelations) {
    if (!game.winner) return;

    await this.prisma.userRating.update({
      where: { userId: game.winner },
      data: { rating: { increment: 10 }, wins: { increment: 1 }, gamesPlayed: { increment: 1 } },
    });

    const loserId = game.winner === game.player1Id ? game.player2Id : game.player1Id;
    if (loserId) {
      await this.prisma.userRating.update({
        where: { userId: loserId },
        data: { rating: { decrement: 10 }, gamesPlayed: { increment: 1 } },
      });
    }
  }

  getGameStream(gameId: string): Observable<any> {
    if (!this.sseStreams.has(gameId)) {
      this.sseStreams.set(gameId, new Subject<any>());
    }
    return this.sseStreams.get(gameId)!.asObservable();
  }

  private emitGameUpdate(gameId: string, game: GameWithRelations) {
    const stream = this.sseStreams.get(gameId);
    if (stream) {
      stream.next({
        id: game.id,
        board: game.board,
        status: game.status,
        currentTurn: game.currentTurn,
        player1: game.player1,
        player2: game.player2,
        spectators: game.spectators,
        winner: game.winner,
      });
    } else {
      console.log(`No stream found for game ${gameId}`); // Логирование отсутствия потока
    }
  }

  async getGame(gameId: string): Promise<GameWithRelations> {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      include: { player1: true, player2: true, spectators: true },
    });
    if (!game) throw new NotFoundException('Game not found');
    return game;
  }
}
