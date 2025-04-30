import { Hero } from '../hero.base';
import { Position } from '../hero.type';
import { HeroMetaData } from './meta.hero';

export class OrcKing extends Hero {
  constructor(playerId: string, position: Position = 0) {
    const baseStats = HeroMetaData['orc_king'];
    super(baseStats, playerId, position);
  }
}
