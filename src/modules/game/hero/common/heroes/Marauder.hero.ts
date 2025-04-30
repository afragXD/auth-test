import { Hero } from '../hero.base';
import { Position } from '../hero.type';
import { HeroMetaData } from './meta.hero';

export class Marauder extends Hero {
  constructor(playerId: string, position: Position = 0) {
    const baseStats = HeroMetaData['marauder'];
    super(baseStats, playerId, position);
  }
}
