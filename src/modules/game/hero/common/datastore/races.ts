export const RACES = {
  HUMAN: 'человек',
  UNDEAD: 'нежить',
  DEAMON: 'демон',
  MYST: 'мистика',
  CONSTRUCTS: 'конструкты',
  NONHUMAN: 'нелюдь'
} as const;

export type RACES = (typeof RACES)[keyof typeof RACES];
