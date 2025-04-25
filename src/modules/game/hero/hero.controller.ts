import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { HeroService } from './hero.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('heroes')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  getAvailableHeroes() {
    return this.heroService.getAllHeroes();
  }
}
