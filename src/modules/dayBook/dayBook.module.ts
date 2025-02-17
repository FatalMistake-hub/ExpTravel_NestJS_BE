import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NativeDayBookRepository } from 'src/repository/day-book.repository';
import { TimeBookDetailModule } from '../timeBookDetail/timeBookDetail.module';
import { DayBookController } from './dayBook.controller';
import { DayBook } from './dayBook.entity';
import { DayBookService } from './dayBook.service';
import { TimeBookDetail } from '../timeBookDetail/timeBookDetail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DayBook, TimeBookDetail]),
    TimeBookDetailModule,
  ],
  providers: [DayBookService, NativeDayBookRepository],
  exports: [DayBookService, TypeOrmModule.forFeature([DayBook])],
  controllers: [DayBookController],
})
export class DayBookModule {}
