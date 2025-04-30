import { Hero } from '../hero.base';
import { Position } from '../hero.type';
import { HeroMetaData } from './meta.hero';

export class Assassin extends Hero {
  constructor(playerId: string, position: Position = 0) {
    const baseStats = HeroMetaData['assassin'];
    super(baseStats, playerId, position);
  }
}
