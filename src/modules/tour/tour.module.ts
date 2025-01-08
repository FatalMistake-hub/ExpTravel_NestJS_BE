import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageDetailsModule } from '../imageDetail/ImageDetail.module';
import { ImageDetailsService } from '../imageDetail/ImageDetail.service';
import {
  NativeTourRepository,
} from './repository/tour.repository';
import { TourController } from './tour.controller';
import { Tour } from './tour.entity';
import { ToursService } from './tour.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { ImageDetail } from '../imageDetail/imageDetail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tour, User, ImageDetail]),
    UsersModule,
    ImageDetailsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwtAccessSecret'),
        signOptions: {
          expiresIn: '30m',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ToursService, NativeTourRepository],
  exports: [ToursService, TypeOrmModule.forFeature([Tour])],
  controllers: [TourController],
})
export class ToursModule {}
