import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { typeOrmAsyncConfig } from 'db/data-source';
import { validate } from 'env.validation';
import configuration from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SeedModule } from './seed/seed.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/AllExceptionsFilter';
import { CategoriesModule } from './modules/category/category.module';
import { ToursModule } from './modules/tour/tour.module';
import { ImageDetailsModule } from './modules/imageDetail/ImageDetail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}`],
      isGlobal: true,
      load: [configuration],
      validate: validate,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    AuthModule,
    UsersModule,
    CategoriesModule,
    ToursModule,
    ImageDetailsModule,
    SeedModule,
  ],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    // {
    //   provide: APP_FILTER,
    //   useClass: AllExceptionsFilter,
    // },
  ],
})
export class AppModule implements NestModule {
  constructor(/*private dataSource: DataSource*/) {
    // console.log('dbName ', dataSource.driver.database);
  }
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('songs'); // option no 1
    // consumer
    //   .apply(LoggerMiddleware)
    //   .forRoutes({ path: 'songs', method: RequestMethod.POST }); //option no 2

    consumer.apply(LoggerMiddleware).forRoutes('*'); //option no 3
  }
}
