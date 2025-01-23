import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { DayBookService } from 'src/modules/dayBook/dayBook.service';
import { DayBookCreateDto } from 'src/modules/dayBook/dto/day-book-create.dto';
import { TimeBookDetailDto } from 'src/modules/time-book-detail/dto/time-book-detail.dto';
import { TimeBookDetailService } from 'src/modules/time-book-detail/timeBookDetail.service';
import { divideTimeRange, getDateRange } from 'src/utils';
import { DayBookStatusEnum } from 'src/utils/enum';

@Processor('time-book-queue')
export class TimeBookProcessor extends WorkerHost {
  private readonly logger = new Logger();
  constructor(
    private readonly dayBookService: DayBookService,
    private readonly timeBookDetailService: TimeBookDetailService,
  ) {
    super();
  }

  async process(job: Job<any>): Promise<void> {
    const { tourDto, tourId } = job.data;
    this.logger.log(`Processing job: ${job.name} for tourId: ${tourId}`);
    switch (job.name) {
      case 'create-time-book-detail': {
        const dateTimes = getDateRange(tourDto.startDay, tourDto.endDay);
        const dayBookCreateDtos: DayBookCreateDto[] = dateTimes.map((date) => ({
          dateName: date,
          tourId,
          status: DayBookStatusEnum.AVAILABLE,
        }));
        for (const dateBook of dayBookCreateDtos) {
          const dayBook = await this.dayBookService.createDayBooking(dateBook);
          //   // TIME PROCESS
          const localTimes = divideTimeRange(
            tourDto.timeBookStart,
            tourDto.timeBookEnd,
            tourDto.timeSlotLength,
          );

          const timeBookDetailDtos: TimeBookDetailDto[] = [];
          for (let i = 0; i < localTimes.length - 1; i++) {
            timeBookDetailDtos.push({
              dayBookId: dayBook.day_book_id,
              startTime: localTimes[i].hour + ':' + localTimes[i].minutes,
              endTime: localTimes[i + 1].hour + ':' + localTimes[i + 1].minutes,
              isPayment: false,
            });
          }

          for (const timeBookDetail of timeBookDetailDtos) {
            await this.timeBookDetailService.createTimeBookDetail(
              timeBookDetail,
            );
            this.logger.log(
              `Created TimeBookDetail: ${timeBookDetail.startTime} - ${timeBookDetail.endTime}`,
            );
          }
        }
        return Promise.resolve();
      }
      default: {
        this.logger.error(`Job name: ${job.name} not found`);
        return Promise.resolve();
      }
    }
  }
}
