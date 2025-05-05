import { BattleMessage, MessageHandler } from "@/types/message-manager";
import { ConsoleMessageHandler } from "./handlers/console-message.handler";

export class MessageManager {
  private static instance: MessageManager;
  private handlers: MessageHandler[] = [];

  private constructor() {
    this.handlers.push(new ConsoleMessageHandler());
  }

  public static getInstance(): MessageManager {
    if (!MessageManager.instance) {
      MessageManager.instance = new MessageManager();
    }
    return MessageManager.instance;
  }

  addHandler(handler: MessageHandler): void {
    this.handlers.push(handler);
  }

  send(message: BattleMessage): void {
    const enrichedMessage = {
      ...message,
      timestamp: Date.now(),
    };
    this.handlers.forEach((handler) => handler.handle(enrichedMessage));
  }
}