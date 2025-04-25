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
  crit: number; //шанс на крит, может быть положительным / отрицательным
  morale: number; //боевой дух
  mana: number; //запас маны
  power: number; //мощь, сила магии
  accuracy: number; //accuracy , точность
}
