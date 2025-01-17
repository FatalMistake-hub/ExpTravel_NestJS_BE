import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeBookDetail } from './timeBookDetail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TimeBookDetail])],
  // providers: [TimeBookDetailService],
  exports: [
    // TimeBookDetailService,
    TypeOrmModule.forFeature([TimeBookDetail]),
  ],
  // controllers: [TimeBookDetailController],
})
export class TimeBookDetailModule {}
