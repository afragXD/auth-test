import randomIntFromInterval from '@/utils/randomIntFromInterval';
import { HeroAdvanced, HeroStats, Position } from './hero.type';
import { MessageManager } from '../../message-manager/message-manager.service';
import { RACES } from './datastore';

const CRIT_MODIFIER = 1.5;
type KillTypes = 1;

export class Hero implements HeroAdvanced {
  id: number;
  name: string;
  key: string;
  descriptionBase: string;
  descriptionGame: string;
  private _health: number;
  damage: number;
  armor: number;
  initiative: number;
  dodge: number;
  luck: number;
  private _morale: number;
  private _mana: number;
  power: number;
  accuracy: number;
  size: 1 | 2 | 3;
  race: RACES;

  playerId: string;
  position: Position;

  critModifier: number;
  maxHealth: number;
  maxMana: number;
  _level: number;

  protected messageManager: MessageManager;

  constructor(
    stats: HeroStats,
    playerId: string,
    position: Position,
  ) {
    this.id = stats.id;
    this.key = stats.key;
    this.name = stats.name;
    this.descriptionBase = stats.descriptionBase;
    this.descriptionGame = stats.descriptionGame;
    this._health = stats.health;
    this.damage = stats.damage;
    this.armor = stats.armor;
    this.initiative = stats.initiative;
    this.dodge = stats.dodge;
    this.luck = stats.luck;
    this._morale = stats.morale;
    this._mana = stats.mana;
    this.power = stats.power;
    this.accuracy = stats.accuracy;
    this.size = stats.size;
    this.race = stats.race;

    this.playerId = playerId;
    this.position = position;

    this.critModifier = 0;
    this.maxHealth = this._health;
    this.maxMana = this._mana;
    this._level = 1;

    this.messageManager = MessageManager.getInstance();
  }

  get level() {
    return this._level;
  }

  set level(value) {
    this._level = Math.max(0, value);
  }

  get morale() {
    return this._morale;
  }

  set morale(value) {
    this._morale = value;
    if (this._morale > -70) {
      return;
    } else if (this._morale <= -100) {
      this.kill(1);
    }
  }

  get health() {
    return this._health;
  }

  set health(value) {
    this._health = value;

    if (this._health <= 0) {
      this.messageManager.send({
        type: 'death',
        message: `${this.name} погибает!`,
        source: this.name,
      });
    }
  }

  get mana() {
    return this._mana;
  }

  set mana(value) {
    this._mana = value;
    // if (value < 0) {
      
    // } else {
    //   this._mana = value;
    // }
  }

  kill(type: KillTypes) {
    this.health = 0;
    if (type === 1) {
      this.messageManager.send({
        type: 'death',
        message: 'Вы не выдерживаете последней психологической атаки',
        source: this.name,
      });
    }
  }

  isAlive() {
    return this.health > 0;
  }

  isFrontRow() {
    return this.position === 0;
  }

  evade(other: Hero) {
    const dodgeChance = other.dodge + 95 - this.accuracy;
    const roll = Math.random() * 100;
    if (roll < dodgeChance) {
      this.messageManager.send({
        type: 'evade',
        message: `${other.name} уклоняется от атаки ${this.name}! Шанс: ${dodgeChance.toFixed(1)}%`,
        source: other.name,
        target: this.name,
      });
      return true;
    }
    return false;
  }

  criticalFailure(other: Hero) {
    const punishment = Math.floor(Math.random() * 3);
    if (punishment === 0) {
      this.messageManager.send({
        type: 'info',
        message: `К счастью, ничего страшного не произошло.`,
        source: this.name,
      });
    } else if (punishment === 1) {
      const selfDamage = Math.max(0, this.damage - this.armor);
      this.health = Math.max(0, this.health - selfDamage);
      this.messageManager.send({
        type: 'attack',
        message: `${this.name} наносит ${selfDamage} урона себе! Осталось ${this.health}/${this.maxHealth} здоровья.`,
        source: this.name,
        target: this.name,
        value: selfDamage,
      });
      if (!this.isAlive()) {
        this.messageManager.send({
          type: 'death',
          message: `${this.name} погиб от собственного провала!`,
          source: this.name,
        });
      }
    } else {
      // добавить удар по союзнику
    }
  }

  spendMana(amount: number) {
    if (amount === -1) return true;
    if (this.mana >= amount) {
      this.mana -= amount;
      // может имеет смысл эффект маг оков?
      return true;
    }
    return false;
  }

  crit(other: Hero) {
    const roll = Math.random() * 100;
    if (this.luck >= 0) {
      if (roll < this.luck) {
        const critMultiplier = Math.max(1, 2 + (this.accuracy / 100 - 1) * 1.4 + this.critModifier);
        this.messageManager.send({
          type: 'crit',
          message: `${this.name} наносит критический удар! Множитель: x${critMultiplier.toFixed(2)}`,
          source: this.name,
          target: other.name,
        });
        this.morale += 5;
        return critMultiplier;
      }
      return 1;
    } else {
      const failChance = Math.abs(this.luck);
      if (roll < failChance) {
        this.messageManager.send({
          type: 'error',
          message: `${this.name} терпит критический провал!`,
          source: this.name,
          target: other.name,
        });
        this.morale -= 5;
        this.criticalFailure(other);
        return -1;
      }
      return 1;
    }
  }

  MeleePattern(other: Hero) {
    if (this.evade(other)) return 0;
    const critModifier = this.crit(other);
    if (critModifier === -1) return 0;
    const damage = Math.max(1, Math.round((this.damage - other.armor + randomIntFromInterval(0, 2)) * critModifier));
    other.health -= damage;
    this.messageManager.send({
      type: 'attack',
      message: `${this.name} наносит ${damage} урона ${other.name}!`,
      source: this.name,
      target: other.name,
      value: damage,
    });
    return damage;
  }

  MagicPattern(other: Hero, manaCoast: number, isMelee: boolean = false) {
    if (isMelee && !this.isFrontRow()) return -1;
    if (!this.spendMana(manaCoast)) return -1;
    if (this.evade(other)) return 0;
    const critModifier = this.crit(other);
    if (critModifier === -1) return 0;
    const damage = Math.max(1, Math.round((this.power + randomIntFromInterval(-5, 5)) * critModifier));
    other.health -= damage;
    this.messageManager.send({
      type: 'attack',
      message: `${this.name} наносит ${damage} урона ${other.name}!`,
      source: this.name,
      target: other.name,
      value: damage,
    });
    return damage;
  }

  getShortInfo(): HeroStats {
    return this;
  }
}
