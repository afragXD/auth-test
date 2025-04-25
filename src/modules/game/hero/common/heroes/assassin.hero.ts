import { Hero } from '../hero.base';

export class Assassin extends Hero {
  constructor() {
    super();
    this.id = 1;
    this.key = 'assassin';
    this.name = 'Ассасин';
    this.descriptionBase =
      'В прошлом сын шефа жандармского отделения, он избрал свой путь вершить правосудие. Злобный хохот - последнее, что слышат жертвы этого праведника.';
    this.descriptionGame =
      'Боец ближнего боя, полагающийся на критические удары, высокую инициативу и уклонение. Может кидать отравленные дротики, накапливать модификатор мгновенного убийства и превращаться в своих целей.';
    this.health = 200;
    this.damage = 28;
    this.armor = 0;
    this.initiative = 48;
  }
}
