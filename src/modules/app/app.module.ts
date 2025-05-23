import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ProviderModule } from '../auth/provider/provider.module';
import { GameModule } from '../game/game.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HeroModule } from '../game/hero/hero.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../', 'assets'),
      serveRoot: '/assets/',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    ProviderModule,
    HeroModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
