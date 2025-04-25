import { Controller, Get, Post, Param, Body, Sse, HttpCode, HttpStatus } from '@nestjs/common';
import { GameService } from './game.service';
import { Authorized } from '../auth/decorators/authorized.decorator';
import { Authorization } from '../auth/decorators/auth.decorator';
import { map, Observable } from 'rxjs';

interface MoveDto {
  row: number;
  col: number;
}

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Authorization()
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async createGame(@Authorized('id') userId: string) {
    return this.gameService.createGame(userId);
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Post(':id/join')
  async joinGame(@Param('id') gameId: string, @Authorized('id') userId: string) {
    return this.gameService.joinGame(gameId, userId);
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Post(':id/spectate')
  async joinAsSpectator(@Param('id') gameId: string, @Authorized('id') userId: string) {
    return this.gameService.joinAsSpectator(gameId, userId);
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Post(':id/move')
  async makeMove(
    @Param('id') gameId: string,
    @Authorized('id') userId: string,
    @Body() move: MoveDto,
  ) {
    return this.gameService.makeMove(gameId, userId, move.row, move.col);
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getGame(@Param('id') gameId: string) {
    return this.gameService.getGame(gameId);
  }

  @Authorization()
  @Sse(':id/stream')
  streamGame(@Param('id') gameId: string): Observable<any> {
    return this.gameService.getGameStream(gameId).pipe(
      map((data) => {
        console.log(`Sending SSE data for game ${gameId}:`, data);
        return { data }; // Формат SSE: data: {...}\n\n
      }),
    );
  }
}
