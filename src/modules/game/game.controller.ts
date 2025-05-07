import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Sse } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { Authorized } from '../auth/decorators/authorized.decorator';
import { Authorization } from '../auth/decorators/auth.decorator';
import { map, Observable } from 'rxjs';
import { Game } from '@/types/game';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Authorization()
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  createGame(@Body() dto: CreateGameDto, @Authorized('id') userId: string) {
    return this.gameService.createGame(userId, dto);
  }

  @Authorization()
  @Sse(':id/stream')
  streamGame(
    @Param('id') gameId: string,
    @Authorized('id') userId: string,
  ): Observable<{ data: Game }> {
    return this.gameService.getGameStream(gameId).pipe(
      map((data) => {
        console.log(`gameId: ${gameId}, userId: ${userId}`);
        return { data };
      }),
    );
  }

  @Authorization()
  @Get()
  getOpenSessions(@Authorized('id') userId: string) {
    return this.gameService.getAvailableGames(userId);
  }
}
