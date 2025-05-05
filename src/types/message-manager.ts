export interface BattleMessage {
  type: 'info' | 'attack' | 'crit' | 'evade' | 'death' | 'error';
  message: string;
  timestamp?: number;
  source?: string; // name??
  target?: string; // other name?
  value?: number;
}

export interface MessageHandler {
  handle(message: BattleMessage): void;
}
