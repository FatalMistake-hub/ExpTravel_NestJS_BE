import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Patch, 
  Post, 
  Query, 
  HttpStatus, 
  HttpException 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { DayBookService } from './dayBook.service';
import { DayBookCreateDto } from './dto/day-book-create.dto';
import { DayBookDto } from './dto/day-book.dto';
import { DayBookViewDto } from './dto/day-book-view.dto';
import { UpdateResponse } from 'src/response/update-response';
import { DayBookPagingResponse } from 'src/response/day-book-paging-response';
import { DayPagingResponse } from 'src/response/day-paging-response';

@ApiTags('Day Booking')
@Controller('day-booking')
export class DayBookController {
  constructor(private readonly dayBookService: DayBookService) {}

  @ApiOperation({ summary: 'Create a new day booking' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Day booking created successfully.' })
  @Post('create/')
  async createDayBooking(@Body() dayBookDto: DayBookCreateDto): Promise<DayBookCreateDto> {
    await this.dayBookService.createDayBooking(dayBookDto);
    return dayBookDto;
  }

  @ApiOperation({ summary: 'Delete a day booking by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Day book ID (UUID)' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Day booking deleted successfully.' })
  @Delete('delete/:id')
  async deleteDayBooking(@Param('id') id: string): Promise<void> {
    await this.dayBookService.deleteByDayBookId(id);
  }

  @ApiOperation({ summary: 'Update day booking fields' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Day booking updated successfully.' })
  @Patch('update-day-time/')
  async updateDayBooking(@Body() fields: Record<string, any>[]): Promise<UpdateResponse> {
    await this.dayBookService.updateDayByField(fields);
    return { message: 'UPDATED SUCCESS', status_code: HttpStatus.OK.toString() };
  }

  @ApiOperation({ summary: 'Get all day bookings' })
  @ApiResponse({ status: HttpStatus.OK, description: 'All day bookings retrieved successfully.' })
  @Get('all/')
  async getAllDayBooking(): Promise<DayBookDto[]> {
    return this.dayBookService.getAllDayBooks();
  }

  @ApiOperation({ summary: 'Get day booking details by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Day book ID (UUID)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Day booking details retrieved successfully.' })
  @Get('detail/:id')
  async getDayBookingDetail(@Param('id') id: string): Promise<DayBookViewDto> {
    return this.dayBookService.getDayBookingById(id);
  }

  @ApiOperation({ summary: 'Get day and time paging by tour ID and time range' })
  @ApiParam({ name: 'tour_id', type: Number, description: 'Tour ID' })
  @ApiParam({ name: 'start_time', type: String, description: 'Start time (ISO string)' })
  @ApiParam({ name: 'end_time', type: String, description: 'End time (ISO string)' })
  @ApiQuery({ name: 'pageNo', type: Number, required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'pageSize', type: Number, required: false, description: 'Page size (default: 5)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Day and time paging retrieved successfully.' })
  @Get('day-time/:tour_id/:start_time/:end_time')
  async getDayTimePagingByTourId(
    @Param('tour_id') tourId: number,
    @Param('start_time') startTime: string,
    @Param('end_time') endTime: string,
    @Query('pageNo') pageNo = 1,
    @Query('pageSize') pageSize = 5
  ): Promise<DayBookPagingResponse> {
    return this.dayBookService.getDayAndTimeByTourId(tourId, startTime, endTime, pageNo, pageSize);
  }

  @ApiOperation({ summary: 'Get day booking paging by tour ID and time range' })
  @ApiParam({ name: 'tour_id', type: Number, description: 'Tour ID' })
  @ApiParam({ name: 'start_time', type: String, description: 'Start time (ISO string)' })
  @ApiParam({ name: 'end_time', type: String, description: 'End time (ISO string)' })
  @ApiQuery({ name: 'pageNo', type: Number, required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'pageSize', type: Number, required: false, description: 'Page size (default: 5)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Day booking paging retrieved successfully.' })
  @Get('day-paging/all/:tour_id/:start_time/:end_time')
  async getDayBookingPagingByTourId(
    @Param('tour_id') tourId: number,
    @Param('start_time') startTime: string,
    @Param('end_time') endTime: string,
    @Query('pageNo') pageNo = 1,
    @Query('pageSize') pageSize = 5
  ): Promise<DayPagingResponse> {
    return this.dayBookService.getDayBookByTourIdPaging(tourId, startTime, endTime, pageNo, pageSize);
  }

  @ApiOperation({ summary: 'Get all day bookings by tour ID (no paging)' })
  @ApiParam({ name: 'tour_id', type: Number, description: 'Tour ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Day bookings retrieved successfully.' })
  @Get('day/all/:tour_id')
  async getDayBookingNotPagingByTourId(@Param('tour_id') tourId: number): Promise<DayBookDto[]> {
    return this.dayBookService.getDayBookByTourId(tourId);
  }
}
