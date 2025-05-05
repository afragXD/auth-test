import { BattleMessage, MessageHandler } from "@/types/message-manager";

export class ConsoleMessageHandler implements MessageHandler {
  handle(message: BattleMessage): void {
    const formattedMessage = `[${message.type.toUpperCase()}] ${message.source || 'System'} -> ${message.target || 'All'}: ${message.message}${message.value !== undefined ? ` (Value: ${message.value})` : ''}`;
    console.log(formattedMessage);
  }
}