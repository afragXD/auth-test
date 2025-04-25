import { Hero } from './hero.base';
import { Abbess } from './heroes/abbess.hero';
import { Assassin } from './heroes/assassin.hero';

const HeroClassMap: Record<string, new (userId: string) => Hero> = {
  Assassin,
  Abbess,
};

export class HeroFactory {
  static createHero(className: string, userId: string): Hero {
    const HeroConstructor = HeroClassMap[className];
    if (!HeroConstructor) {
      throw new Error(`Unknown hero class: ${className}`);
    }
    return new HeroConstructor(userId);
  }

  static listAvailableHeroes(): string[] {
    return Object.keys(HeroClassMap);
  }
}
