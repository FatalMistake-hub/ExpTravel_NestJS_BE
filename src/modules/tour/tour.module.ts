import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ImageDetail } from '../imageDetail/imageDetail.entity';
import { ImageDetailsModule } from '../imageDetail/ImageDetail.module';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { NativeTourRepository } from '../../repository/tour.repository';
import { TourController } from './tour.controller';
import { Tour } from './tour.entity';
import { ToursService } from './tour.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tour, User, ImageDetail]),
    UsersModule,
    ImageDetailsModule,
    // AuthModule,
  ],
  providers: [ToursService, NativeTourRepository],
  exports: [ToursService, TypeOrmModule.forFeature([Tour])],
  controllers: [TourController],
})
export class ToursModule {}
