import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserModule } from '../user/user.module';

@Module({
  imports: [EventEmitterModule.forRoot(), UserModule],
  controllers: [GameController],
  providers: [GameService, PrismaService],
})
export class GameTestModule {}
