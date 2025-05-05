export const RESISTS = {
  DEFAULT: 'жизнь',
  WEARPON: 'оружие',
  ARROWS: 'снаряды',

  MIND: 'разум',
  DEATH: 'смерть',
  FIRE: 'огонь',
  AIR: 'воздух',
  EARTH: 'земля',
  WATER: 'вода',

  DESTROY_ARMOR: 'разрушение брони',

  POSION: 'яд'
} as const;

export type RESISTS = (typeof RESISTS)[keyof typeof RESISTS];
