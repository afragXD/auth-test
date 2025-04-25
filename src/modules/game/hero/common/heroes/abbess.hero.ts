import { Hero } from '../hero.base';

export class Abbess extends Hero {
  constructor() {
    super();
    this.id = 2;
    this.key = 'abbess';
    this.name = 'Аббатиса';
    this.descriptionBase =
      'Настоятельница северного монастыря. Циклы ожесточили её, неоднократно заставляя сомневаться в священности человеческой жизни.';
    this.descriptionGame =
      'Полубоевой юнит поддержки. Колдует солнечные молнии, способные замедлить противника. Массовое лечение. Даёт варды и рассеивает эффекты. Может временно усилить броню. Со старта имеет перк на +20% торговли.';
    this.health = 205;
    this.damage = 5;
    this.armor = 0;
    this.initiative = 30;
  }
}
