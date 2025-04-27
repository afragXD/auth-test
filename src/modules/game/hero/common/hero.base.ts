import { HeroStats } from './hero.type';

export type HeroShortInfo = Pick<
  HeroStats,
  'id' | 'name' | 'descriptionBase' | 'descriptionGame' | 'key' | 'size'
>;

export class Hero implements HeroStats {
  id: number;
  name: string;
  key: string;
  descriptionBase: string;
  descriptionGame: string;
  health: number;
  damage: number;
  armor: number;
  initiative: number;
  dodge: number;
  crit: number;
  morale: number;
  mana: number;
  power: number;
  accuracy: number;
  size: 1 | 2 | 3;

  constructor() {
    this.id = 0;
    this.name = 'Hero';
    this.key = 'Hero';
    this.descriptionBase = 'Базовый герой';
    this.descriptionGame = 'Самый базовый герой';
    this.health = 100;
    this.damage = 10;
    this.armor = 10;
    this.initiative = 10;
    this.dodge = 10;
    this.crit = 1;
    this.morale = 1;
    this.mana = 10;
    this.power = 1;
    this.accuracy = 95;
    this.size = 1;
  }

  getShortInfo(): HeroShortInfo {
    return {
      id: this.id,
      name: this.name,
      descriptionBase: this.descriptionBase,
      descriptionGame: this.descriptionGame,
      key: this.key,
      size: this.size,
    };
  }
}
