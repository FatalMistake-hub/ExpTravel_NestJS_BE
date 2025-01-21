import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NativeDayBookRepository } from 'src/repository/day-book.repository';
import { TimeBookDetailModule } from '../time-book-detail/timeBookDetail.module';
import { DayBookController } from './daybook.controller';
import { DayBook } from './dayBook.entity';
import { DayBookService } from './dayBook.service';
import { TimeBookDetail } from '../time-book-detail/timeBookDetail.entity';

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
