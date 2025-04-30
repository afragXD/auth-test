export interface HeroStats {
  id: number;
  key: string;
  name: string;
  descriptionBase: string;
  descriptionGame: string;

  health: number;
  damage: number; //атака, физический урон
  armor: number; //броня
  initiative: number; //инициатива
  dodge: number; //(уклонение)
  luck: number; //шанс на крит, может быть положительным / отрицательным
  morale: number; //боевой дух
  mana: number; //запас маны
  power: number; //мощь, сила магии
  accuracy: number; //accuracy , точность

  size: 1 | 2 | 3;
}

export type Position = 0 | 1;

export interface HeroAdvanced extends HeroStats {
  playerId: string;
  position: Position;

  critModifier: number;
  maxHealth: number;
}
