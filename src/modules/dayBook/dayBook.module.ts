import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DayBook } from './dayBook.entity';
import { DayBookController } from './daybook.controller';
import { DayBookService } from './dayBook.service';

@Module({
  imports: [TypeOrmModule.forFeature([DayBook])],
  providers: [DayBookService],
  exports: [
    DayBookService,
    TypeOrmModule.forFeature([DayBook]),
  ],
  controllers: [DayBookController],
})
export class DayBookModule {}
