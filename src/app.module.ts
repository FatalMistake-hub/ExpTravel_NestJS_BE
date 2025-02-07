import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { DataSource } from 'typeorm';

import {
  CamelCaseNamingConvention,
  SnakeCaseNamingConvention,
} from '@automapper/core';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { typeOrmAsyncConfig } from 'db/data-source';
import { validate } from 'env.validation';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import configuration from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guard/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guard/role.guard';
import { CategoriesModule } from './modules/category/category.module';
import { DayBookModule } from './modules/dayBook/dayBook.module';
import { ImageDetailsModule } from './modules/imageDetail/ImageDetail.module';
import { TimeBookDetailModule } from './modules/timeBookDetail/timeBookDetail.module';
import { ToursModule } from './modules/tour/tour.module';
import { UsersModule } from './modules/users/users.module';
import { SeedModule } from './seed/seed.module';
import { DayBookService } from './modules/dayBook/dayBook.service';
import { TimeBookDetailController } from './modules/timeBookDetail/timeBookDetail.controller';
import { TimeBookDetailService } from './modules/timeBookDetail/timeBookDetail.service';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { BullModule } from '@nestjs/bullmq';
import { AppListener } from './app.listener';
import { HttpExceptionFilter } from './common/filters/GlobalFilterException';
import { DayBookController } from './modules/dayBook/dayBook.controller';
import { HealthModule } from './modules/health/health.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { GuestModule } from './modules/guest/guest.module';
import { PaymentModule } from './modules/payment/payment.module';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}`],
      isGlobal: true,
      load: [configuration],
      validate: validate,
    }),
    ScheduleModule.forRoot(),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
      namingConventions: {
        source: new CamelCaseNamingConvention(),
        destination: new SnakeCaseNamingConvention(),
      },
    }),
    // BullModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     connection: {
    //       host: configService.get<string>('redisHost'),
    //       port: configService.get<number>('redisPort'),
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    AuthModule,
    UsersModule,
    CategoriesModule,
    ToursModule,
    ImageDetailsModule,
    SeedModule,
    DayBookModule,
    TimeBookDetailModule,
    WalletModule,
    GuestModule,
    PaymentModule,
    OrderModule,
    HealthModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AppListener
  ],
  controllers: [DayBookController, TimeBookDetailController],
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
