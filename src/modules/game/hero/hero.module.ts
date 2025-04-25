import { Module } from '@nestjs/common';
import { HeroService } from './hero.service';
import { HeroController } from './hero.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register({ ttl: 60000 })],
  controllers: [HeroController],
  providers: [HeroService],
})
export class HeroModule {}
