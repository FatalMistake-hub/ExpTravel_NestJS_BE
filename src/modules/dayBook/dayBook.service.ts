import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { NativeDayBookRepository } from 'src/repository/day-book.repository';
import { DayBookPagingResponse } from 'src/response/day-book-paging-response';
import { DayPagingResponse } from 'src/response/day-paging-response';
import { DeleteResponse } from 'src/response/delete-response';
import { TimeBookDetailService } from '../time-book-detail/timeBookDetail.service';
import { DayBook } from './daybook.entity';
import { DayBookCreateDto } from './dto/day-book-create.dto';
import { DayBookUpdate } from './dto/day-book-update.dto';
import { DayBookViewDto } from './dto/day-book-view.dto';
import { DayBookDto } from './dto/day-book.dto';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';

@Injectable()
export class DayBookService extends AutomapperProfile {
  constructor(
    @InjectRepository(NativeDayBookRepository)
    @InjectRepository(TimeBookDetailService)
    private readonly nativeDayBookRepository: NativeDayBookRepository,
    private readonly timeBookDetailService: TimeBookDetailService,
    @InjectMapper() mapper: Mapper,
  ) {
    super(mapper);
  }
  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, DayBookCreateDto, DayBook);
      createMap(mapper, DayBook, DayBookCreateDto);
    };
  }

  async getAllDayBooks(): Promise<DayBookDto[]> {
    const dayBooks = await this.nativeDayBookRepository.find();
    return dayBooks.map((dayBook) => this.mapToDto(dayBook));
  }

  async createDayBooking(dayBookDto: DayBookCreateDto): Promise<DayBook> {
    const dayBook = this.mapper.map(dayBookDto, DayBookCreateDto, DayBook);

    return await this.nativeDayBookRepository.save(dayBook);
  }

  async deleteByDayBookId(id: string): Promise<DeleteResponse> {
    const dayBook = await this.nativeDayBookRepository.findOne({
      where: { day_book_id: id },
    });
    if (!dayBook) throw new NotFoundException('DayBooking not found');

    if (dayBook.is_deleted) {
      return new DeleteResponse('THIS DAYBOOK IS DELETED');
    }

    dayBook.is_deleted = true;
    await this.nativeDayBookRepository.save(dayBook);

    return new DeleteResponse('Delete Success');
  }

  async getDayBookingById(id: string): Promise<DayBookViewDto> {
    const dayBook = await this.nativeDayBookRepository.findOne({
      where: { day_book_id: id },
    });
    if (!dayBook) throw new NotFoundException('DayBooking not found');

    const timeBookDetails =
      await this.timeBookDetailService.getAllTimeBookForDayByDayBookId(id);

    return {
      ...this.mapToDto(dayBook),
      timeBookDetailList: timeBookDetails,
    };
  }

  async getDayAndTimeByTourId(
    tourId: number,
    start: string,
    end: string,
    pageNo: number,
    pageSize: number,
  ): Promise<DayBookPagingResponse> {
    const startDate = moment(start, 'YYYY-MM-DD').toDate();
    const endDate = moment(end, 'YYYY-MM-DD').toDate();

    const dayBooks =
      await this.nativeDayBookRepository.getDayBookByTourIdPaging(
        tourId,
        startDate,
        endDate,
        pageNo,
        pageSize,
      );

    const dayBookViewDtoList: DayBookViewDto[] = [];

    for (const dayBook of dayBooks) {
      const dayBookViewDto = this.mapToDto(dayBook);

      const timeBookViewDtoList =
        await this.timeBookDetailService.getAllTimeBookForDayByDayBookId(
          dayBook.day_book_id,
        );
      dayBookViewDto.timeBookDetailList = timeBookViewDtoList;

      dayBookViewDtoList.push(dayBookViewDto);
    }

    const dayBookPagingResponse = new DayBookPagingResponse();
    dayBookPagingResponse.content = dayBookViewDtoList;
    dayBookPagingResponse.pageNo = pageNo;
    dayBookPagingResponse.pageSize = pageSize;
    dayBookPagingResponse.totalElements = dayBooks.length;
    dayBookPagingResponse.totalPages = Math.ceil(dayBooks.length / pageSize);

    return dayBookPagingResponse;
  }

  async getDayBookByTourIdPaging(
    tourId: number,
    start: string,
    end: string,
    pageNo: number,
    pageSize: number,
  ): Promise<DayPagingResponse> {
    const [dayBooks, total] =
      await this.nativeDayBookRepository.getDayBookByTourIdPaging(
        tourId,
        new Date(start),
        new Date(end),
        pageNo,
        pageSize,
      );

    const content = await Promise.all(
      dayBooks?.map(async (dayBook) => {
        const timeBookDetails =
          await this.timeBookDetailService.getAllTimeBookForDayByDayBookId(
            dayBook.id,
          );

        return {
          dayBookId: dayBook.day_book_id,
          tourId: dayBook.tour_id.toString(),
          dateName: dayBook.date_name.toISOString().split('T')[0],
          status: dayBook.status,
          isDeleted: dayBook.is_deleted,
          timeBookDetailList: timeBookDetails,
        };
      }),
    );

    return {
      content,
      pageNo,
      pageSize,
      totalElements: total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getDayBookByTourId(tourId: number): Promise<DayBookDto[]> {
    const dayBooks = await this.nativeDayBookRepository.find({
      where: { tour_id: tourId },
    });
    return dayBooks.map((dayBook) => this.mapToDto(dayBook));
  }

  async updateDayByField(fields: Partial<DayBookUpdate>[]): Promise<void> {
    for (const item of fields) {
      const dayBook = await this.nativeDayBookRepository.findOne({
        where: { day_book_id: item.dayBookId },
      });
      if (!dayBook) continue;

      Object.assign(dayBook, item);

      if (item.timeBookDetailList) {
        await this.timeBookDetailService.updateTimeBookByField(
          item.timeBookDetailList,
        );
      }

      await this.nativeDayBookRepository.save(dayBook);
    }
  }

  private mapToDto(dayBook: DayBook): DayBookViewDto {
    return {
      dayBookId: dayBook.day_book_id,
      tourId: dayBook.tour_id,
      dateName: moment(dayBook.date_name).toISOString().split('T')[0],
      status: dayBook.status,
      isDeleted: dayBook.is_deleted,
    };
  }
}
