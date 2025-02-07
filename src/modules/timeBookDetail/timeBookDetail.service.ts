import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';

import { TimeBookDetailDto } from './dto/time-book-detail.dto'; // Assuming DTOs are defined
import { TimeBookViewDto } from './dto/time-book-view.dto'; // Assuming DTOs are defined
import { TimeBookDetail } from './timeBookDetail.entity';
import { DeleteResponse } from 'src/response/delete-response';
import { NativeTimeBookRepository } from 'src/repository/time-book.repository';

@Injectable()
export class TimeBookDetailService {
  constructor(
    @InjectRepository(NativeTimeBookRepository)
    @InjectRepository(TimeBookDetail)
    private readonly nativeTimeBookRepository: NativeTimeBookRepository,
  ) {}

  // Get all TimeBook details
  async getAllTimeBookDetail(): Promise<TimeBookViewDto[]> {
    const timeBookDetails = await this.nativeTimeBookRepository.find();
    return timeBookDetails.map((timeBook) => new TimeBookViewDto(timeBook));
  }

  // Create a single TimeBook detail
  async createTimeBookDetail(
    timeBookDetailDto: Omit<TimeBookDetailDto, 'timeId'>,
  ): Promise<Omit<TimeBookDetailDto, 'timeId'>> {
    const { startTime, endTime, dayBookId, isPayment } = timeBookDetailDto;

    const formattedStartTime = moment(startTime, 'HH:mm').format('HH:mm');
    const formattedEndTime = moment(endTime, 'HH:mm').format('HH:mm');

    await this.nativeTimeBookRepository.saveTimeBookDetail(
      formattedStartTime,
      formattedEndTime,
      dayBookId,
      isPayment,
    );

    return timeBookDetailDto;
  }

  // Delete TimeBook by ID
  async deleteByTimeBookId(id: string): Promise<DeleteResponse> {
    const timeBookDetail = await this.nativeTimeBookRepository.findOne({
      where: { time_id: id },
    });
    if (!timeBookDetail) {
      throw new NotFoundException('TimeBook not found');
    }

    if (timeBookDetail.is_deleted) {
      return new DeleteResponse('THIS TIME BOOK IS DELETED');
    }

    timeBookDetail.is_deleted = true;
    await this.nativeTimeBookRepository.save(timeBookDetail);
    return new DeleteResponse('Delete Success');
  }

  // Update TimeBook by ID
  async updateByTimeBookId(
    timeBookDetailDto: Partial<TimeBookDetailDto>,
    id: string,
  ): Promise<Partial<TimeBookDetailDto>> {
    const timeBookDetail = await this.nativeTimeBookRepository.findOne({
      where: { time_id: id },
    });
    if (!timeBookDetail) {
      throw new NotFoundException('TimeBook not found');
    }

    const { startTime, endTime, isPayment } = timeBookDetailDto;
    startTime &&
      (timeBookDetail.start_time = moment(startTime, 'HH:mm').format('HH:mm'));
    endTime &&
      (timeBookDetail.end_time = moment(endTime, 'HH:mm').format('HH:mm'));
    timeBookDetail.is_payment = isPayment;

    await this.nativeTimeBookRepository.save(timeBookDetail);
    return timeBookDetailDto;
  }

  // Get TimeBook by ID
  async getTimeBookingById(id: string): Promise<TimeBookViewDto> {
    const timeBookDetail = await this.nativeTimeBookRepository.findOneOrFail({
      where: { time_id: id },
    });
    console.log(timeBookDetail);
    if (!timeBookDetail) {
      throw new NotFoundException('TimeBook not found');
    }
    return new TimeBookViewDto(timeBookDetail);
  }
  // Get TimeBook by ID
  async getTimeBookDetailById(id: string): Promise<TimeBookDetail> {
    const timeBookDetail = await this.nativeTimeBookRepository.findOneOrFail({
      where: { time_id: id },
    });
    console.log(timeBookDetail);
    if (!timeBookDetail) {
      throw new NotFoundException('TimeBook not found');
    }
    return timeBookDetail
  }
  async updateStatusPayment(id: string, status: boolean): Promise<void> {
    const timeBookDetail = await this.nativeTimeBookRepository.findOneOrFail({
      where: { time_id: id },
    });
    if (!timeBookDetail) {
      throw new NotFoundException('TimeBook not found');
    }
    timeBookDetail.is_payment = status;
    await this.nativeTimeBookRepository.save(timeBookDetail);
  }

  // Create a list of TimeBook details
  async createListTimeBookDetail(
    timeBookDetailDtos: TimeBookDetailDto[],
  ): Promise<TimeBookDetailDto[]> {
    const timeBookDetails = timeBookDetailDtos.map((dto) => {
      const { startTime, endTime, dayBookId, isPayment } = dto;

      const formattedStartTime = moment(startTime, 'HH:mm').format('HH:mm');
      const formattedEndTime = moment(endTime, 'HH:mm').format('HH:mm');

      return this.nativeTimeBookRepository.create({
        start_time: formattedStartTime,
        end_time: formattedEndTime,
        day_book_id: dayBookId,
        is_payment: isPayment,
      });
    });

    await this.nativeTimeBookRepository.save(timeBookDetails);
    return timeBookDetailDtos;
  }

  // Get all TimeBook details for a specific DayBook ID
  async getAllTimeBookForDayByDayBookId(
    dayBookId: string,
  ): Promise<TimeBookViewDto[]> {
    const timeBookDetails =
      await this.nativeTimeBookRepository.getAllListTimeBookByDayBookId(
        dayBookId,
      );
    return timeBookDetails.map((timeBook) => new TimeBookViewDto(timeBook));
  }

  // Update TimeBook by specific fields
  async updateTimeBookByField(
    fields: Array<Record<string, any>>,
  ): Promise<void> {
    for (const item of fields) {
      const { timeId, ...updates } = item;
      const timeBook = await this.nativeTimeBookRepository.findOne(timeId);
      if (!timeBook) {
        throw new NotFoundException('TimeBook not found');
      }

      for (const [key, value] of Object.entries(updates)) {
        if (key === 'start_time' || key === 'end_time') {
          timeBook[key] = moment(value, 'HH:mm').format('HH:mm');
        } else {
          timeBook[key] = value;
        }
      }

      await this.nativeTimeBookRepository.save(timeBook);
    }
  }
}
