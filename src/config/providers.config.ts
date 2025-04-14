import { TypeOptions } from '@/modules/auth/provider/provider.constants';
import { GoogleProvider } from '@/modules/auth/provider/services/google.provider';
import { YandexProvider } from '@/modules/auth/provider/services/yandex.provider';
import { ConfigService } from '@nestjs/config';

export const getProvidersConfig = (configService: ConfigService): TypeOptions => ({
  baseUrl: configService.getOrThrow<string>('APPLICATION_URL'),
  services: [
    new GoogleProvider({
      client_id: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      client_secret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      scopes: ['email', 'profile'],
    }),
    new YandexProvider({
      client_id: configService.getOrThrow<string>('YANDEX_CLIENT_ID'),
      client_secret: configService.getOrThrow<string>('YANDEX_CLIENT_SECRET'),
      scopes: ['login:email', 'login:avatar', 'login:info'],
    }),
  ],
});
