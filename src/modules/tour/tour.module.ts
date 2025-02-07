import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NativeTourRepository } from 'src/repository/tour.repository';
import { NativeUserRepository } from 'src/repository/user.repository';
import { DayBookModule } from '../dayBook/dayBook.module';
import { ImageDetailsModule } from '../imageDetail/ImageDetail.module';
import { TimeBookDetailModule } from '../timeBookDetail/timeBookDetail.module';
import { UsersModule } from '../users/users.module';
import { TimeBookProcessor } from './queue/time-book-queue';
import { TourController } from './tour.controller';
import { Tour } from './tour.entity';
import { ToursService } from './tour.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tour]),
    UsersModule,
    ImageDetailsModule,
    DayBookModule,
    TimeBookDetailModule,
    // AuthModule,

    BullModule.registerQueue({
      name: 'time-book-queue',
    }),
  ],
  providers: [
    ToursService,
    NativeTourRepository,
    NativeUserRepository,
    TimeBookProcessor,
  ],
  exports: [ToursService, TypeOrmModule.forFeature([Tour])],
  controllers: [TourController],
})
export class ToursModule {}
