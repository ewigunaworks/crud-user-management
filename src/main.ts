import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Server');

  
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const appPort = configService.get<string>('APP_PORT');
  await app.listen(appPort, () => {
    logger.log(`Running on port: ${appPort}`);
  });
}
bootstrap();
