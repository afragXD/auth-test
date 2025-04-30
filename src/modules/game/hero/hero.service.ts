import { Injectable } from '@nestjs/common';
import { HeroFactory } from './common/hero.factory';
import { HeroStats } from './common/hero.type';
import { HeroMetaData } from './common/heroes/meta.hero';

@Injectable()
export class HeroService {
  getAllHeroes(): HeroStats[] {
    return Object.values(HeroMetaData);
  }

  createHeroForUser(className: string, userId: string) {
    return HeroFactory.createHero(className, userId);
  }
}
