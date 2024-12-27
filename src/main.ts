import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './seed/seed.service';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/GlobalFilterException';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  /**
   * You can enable the seeding here
   */
  // app.useGlobalFilters(new HttpExceptionFilter());
  const seedService = app.get(SeedService);
  await seedService.seed();

  const config = new DocumentBuilder() //1
    .setTitle('ExpTravel')
    .setDescription('The ExpTravel Api documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config); //2
  SwaggerModule.setup('api', app, document); //3

  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('port'));

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
