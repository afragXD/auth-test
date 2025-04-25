import { Injectable } from '@nestjs/common';
import { HeroFactory } from './common/hero.factory';
import { HeroShortInfo } from './common/hero.base';

@Injectable()
export class HeroService {
  getAllHeroes(): HeroShortInfo[] {
    return HeroFactory.listAvailableHeroes().map((className) => {
      const tempHero = HeroFactory.createHero(className, 'preview');
      return tempHero.getShortInfo();
    });
  }

  createHeroForUser(className: string, userId: string) {
    return HeroFactory.createHero(className, userId);
  }
}
