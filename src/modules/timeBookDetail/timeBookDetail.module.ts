import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NativeTimeBookRepository } from 'src/repository/time-book.repository';
import { TimeBookDetail } from './timeBookDetail.entity';
import { TimeBookDetailService } from './timeBookDetail.service';
import { TimeBookDetailController } from './timeBookDetail.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TimeBookDetail]),
  ],
  providers: [TimeBookDetailService, NativeTimeBookRepository],
  exports: [TimeBookDetailService, TypeOrmModule.forFeature([TimeBookDetail])],
  controllers: [TimeBookDetailController],
})
export class TimeBookDetailModule {}
