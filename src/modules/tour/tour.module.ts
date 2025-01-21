import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ImageDetail } from '../imageDetail/imageDetail.entity';
import { ImageDetailsModule } from '../imageDetail/ImageDetail.module';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { TourController } from './tour.controller';
import { Tour } from './tour.entity';
import { ToursService } from './tour.service';
import { NativeTourRepository } from 'src/repository/tour.repository';
import { DayBookModule } from '../dayBook/dayBook.module';
import { TimeBookDetailModule } from '../time-book-detail/timeBookDetail.module';
import { NativeUserRepository } from 'src/repository/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tour]),
    UsersModule,
    ImageDetailsModule,
    DayBookModule,
    TimeBookDetailModule
    // AuthModule,
  ],
  providers: [ToursService, NativeTourRepository,NativeUserRepository],
  exports: [ToursService, TypeOrmModule.forFeature([Tour])],
  controllers: [TourController],
})
export class ToursModule {}
