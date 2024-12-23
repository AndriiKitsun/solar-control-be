import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { AppConfigType, APP_NAMESPACE } from '@config/app';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      cors: true,
    },
  );

  app.useWebSocketAdapter(new WsAdapter(app));

  const configService = app.get(ConfigService);
  const config = configService.get<AppConfigType>(APP_NAMESPACE)!;

  await app.listen(config.port, '0.0.0.0');
}

void bootstrap();
