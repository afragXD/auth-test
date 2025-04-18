import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as cookie from 'cookie';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private sessionMiddleware;

  constructor(private readonly config: ConfigService) {
    const sessionSecret = config.getOrThrow<string>('SESSION_SECRET');
    this.sessionMiddleware = session({
      secret: sessionSecret,
      resave: true,
      saveUninitialized: false,
      name: config.getOrThrow<string>('SESSION_NAME'),
      cookie: {
        secure: false,
      },
    });
  }

  afterInit(server: Server) {
    // Оборачиваем сессию для socket.io
    server.use((socket, next) => {
      const req = socket.request as any;
      const cookies = cookie.parse(req.headers.cookie || '');
      const rawCookie = cookies[this.config.getOrThrow('SESSION_NAME')];
      req.cookies = cookies;

      // Нужно распарсить куки вручную
      cookieParser(this.config.getOrThrow('COOKIES_SECRET'))(req, {} as any, () => {
        this.sessionMiddleware(req, {} as any, next);
      });
    });
  }

  handleConnection(client: Socket) {
    const req = client.request as any;
    const session = req.session;
    if (!session || !session.user) {
      client.disconnect(true);
      return;
    }

    console.log(`Client connected: ${session.user.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected');
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string, @ConnectedSocket() client: Socket): string {
    const req = client.request as any;
    console.log(`Message from ${req.session.user.id}: ${message}`);
    return `Echo: ${message}`;
  }
}
