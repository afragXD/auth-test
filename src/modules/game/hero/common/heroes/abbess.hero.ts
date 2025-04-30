import { Hero } from '../hero.base';
import { Position } from '../hero.type';
import { HeroMetaData } from './meta.hero';

export class Abbess extends Hero {
  constructor(playerId: string, position: Position = 0) {
    const baseStats = HeroMetaData['abbess'];
    super(baseStats, playerId, position);
  }
}
