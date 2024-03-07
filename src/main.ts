import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LogInterceptor } from './interceptors/log.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalInterceptors(new LogInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api/v1.0');
  await app.listen(3000);
}
bootstrap();
