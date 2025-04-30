import { Hero } from '../hero.base';
import { Position } from '../hero.type';
import { HeroMetaData } from './meta.hero';

export class DemonLord extends Hero {
  constructor(playerId: string, position: Position = 0) {
    const baseStats = HeroMetaData['demon_lord'];
    super(baseStats, playerId, position);
  }
}
