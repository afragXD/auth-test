import { HeroAdvanced, HeroStats, Position } from './hero.type';

const CRIT_MODIFIER = 1.5;
type KillTypes = 1

export class Hero implements HeroAdvanced {
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
  luck: number;
  private _morale: number;
  mana: number;
  power: number;
  accuracy: number;
  size: 1 | 2 | 3;

  playerId: string;
  position: Position;

  critModifier: number;
  maxHealth: number;

  constructor(stats: HeroStats, playerId: string, position: Position) {
    this.id = stats.id;
    this.key = stats.key;
    this.name = stats.name;
    this.descriptionBase = stats.descriptionBase;
    this.descriptionGame = stats.descriptionGame;
    this.health = stats.health;
    this.damage = stats.damage;
    this.armor = stats.armor;
    this.initiative = stats.initiative;
    this.dodge = stats.dodge;
    this.luck = stats.luck;
    this._morale = stats.morale;
    this.mana = stats.mana;
    this.power = stats.power;
    this.accuracy = stats.accuracy;
    this.size = stats.size;

    this.playerId = playerId;
    this.position = position;

    this.critModifier = CRIT_MODIFIER;
    this.maxHealth = this.health;
  }

  kill(type: KillTypes) {
    this.health = 0;
    if (type === 1) {
      console.log('Вы не выдерживаете последней психологической атаки');
    }
    console.log(`${this.name} погибает!`);
  }

  isAlive() {
    return this.health > 0;
  }

  get morale() {
    return this._morale;
  }

  set morale(value: number) {
    this._morale = value;
    if (this._morale > -70) {
      return;
    } else if (this._morale <= -100) {
      this.kill(1);
    }
  }

  evade(other: Hero) {
    const dodgeChance = other.dodge + 95 - this.accuracy;
    const roll = Math.random() * 100;
    if (roll < dodgeChance) {
      console.log(
        `👏 ${other.name} уклоняется от атаки ${this.name}! Шанс: ${dodgeChance.toFixed(1)}%`,
      );
      return true;
    }
    return false;
  }

  criticalFailure(other: Hero) {
    const punishment = Math.floor(Math.random() * 3);
    if (punishment === 0) {
      console.log(`К счастью, ничего страшного не произошло.`);
    } else if (punishment === 1) {
      const selfDamage = Math.max(0, this.damage - this.armor);
      this.health = Math.max(0, this.health - selfDamage);
      console.log(
        `🤕 ${this.name} наносит ${selfDamage} урона себе! Осталось ${this.health}/${this.maxHealth} здоровья.`,
      );
      if (!this.isAlive()) {
        console.log(`💀 ${this.name} погиб от собственного провала!`);
      }
    } else {
      // добавить удар по союзнику
    }
  }

  critChance(other: Hero) {
    const roll = Math.random() * 100;
    if (this.luck >= 0) {
      if (roll < this.luck) {
        const critMultiplier = Math.max(1, 2 + (this.accuracy / 100 - 1) * 1.4 + this.critModifier);
        console.log(
          `💥 ${this.name} наносит критический удар! Множитель: x${critMultiplier.toFixed(2)}`,
        );
        this.morale += 5;
        return critMultiplier;
      }
      return 1;
    } else {
      const failChance = Math.abs(this.luck);
      if (roll < failChance) {
        console.log(`😣 ${this.name} терпит критический провал!`);
        this.morale -= 5;
        this.criticalFailure(other);
        return -1;
      }
      return 1;
    }
  }

  MeleePattern(other: Hero) {
    if (this.evade(other)) return 0;
  }

  getShortInfo(): HeroStats {
    return this;
  }
}
