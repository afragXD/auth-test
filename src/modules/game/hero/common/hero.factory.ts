import { Hero } from './hero.base';
import { Abbess, Assassin, DemonLord, Marauder, OrcKing } from './heroes';
import { HeroMetaData } from './heroes/meta.hero';

const HeroClassMap: Record<string, new (userId: string) => Hero> = {
  assassin: Assassin,
  abbess: Abbess,
  marauder: Marauder,
  orc_king: OrcKing,
  demon_lord: DemonLord,
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
    return Object.keys(HeroMetaData);
  }
}
