export const ArenaRank = {
  PIT_DOG: { label: 'Бойцовый пёс', slug: 'pit-dog' },
  BRAWLER: { label: 'Драчун', slug: 'brawler' },
  BLOODLETTER: { label: 'Кровопускатель', slug: 'bloodletter' },
  MYRMIDON: { label: 'Мирмидонец', slug: 'myrmidon' },
  WARRIOR: { label: 'Воин', slug: 'warrior' },
  GLADIATOR: { label: 'Гладиатор', slug: 'gladiator' },
  HERO: { label: 'Герой', slug: 'hero' },
  CHAMPION: { label: 'Чемпион', slug: 'champion' },
  GRAND_CHAMPION: { label: 'Великий Чемпион', slug: 'grand-champion' },
} as const;

export type ArenaRank = (typeof ArenaRank)[keyof typeof ArenaRank];

export const getArenaRank: (rating: number) => ArenaRank = (rating: number) => {
  switch (true) {
    case rating >= 1800:
      return ArenaRank.GRAND_CHAMPION;
    case rating >= 1700:
      return ArenaRank.CHAMPION;
    case rating >= 1600:
      return ArenaRank.HERO;
    case rating >= 1500:
      return ArenaRank.GLADIATOR;
    case rating >= 1400:
      return ArenaRank.WARRIOR;
    case rating >= 1300:
      return ArenaRank.MYRMIDON;
    case rating >= 1200:
      return ArenaRank.BLOODLETTER;
    case rating >= 1100:
      return ArenaRank.BRAWLER;
    default:
      return ArenaRank.PIT_DOG;
  }
};
