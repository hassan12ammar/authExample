import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const configService = new ConfigService()
  const PORT = configService.get<number>('PORT');

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))

  app.useGlobalInterceptors(new ClassSerializerInterceptor(
    app.get(Reflector)
  ))

  app.use(cookieParser());

  await app.listen(PORT);
  Logger.log(`🚀 Application is running on: http://localhost:${PORT}`);
}
bootstrap();
