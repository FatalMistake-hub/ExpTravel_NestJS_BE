import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  HttpStatus,
  Res,
} from '@nestjs/common';

import { Response } from 'express';
import { TimeBookDetailDto } from './dto/time-book-detail.dto';
import { TimeBookDetailService } from './timeBookDetail.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Time Book Detail')
@Controller('time-book')
export class TimeBookDetailController {
  constructor(private readonly timeBookDetailService: TimeBookDetailService) {}

  @Post('create/')
  async createTimeBookForDay(
    @Body() timeBookDetailDto: Omit<TimeBookDetailDto, 'timeId'>,
    @Res() res: Response,
  ) {
    await this.timeBookDetailService.createTimeBookDetail(timeBookDetailDto);
    return res.status(HttpStatus.CREATED).json(timeBookDetailDto);
  }

  @Post('create-list/')
  async createListTimeBookForDay(
    @Body() timeBookDetailDtos: TimeBookDetailDto[],
    @Res() res: Response,
  ) {
    await this.timeBookDetailService.createListTimeBookDetail(timeBookDetailDtos);
    return res.status(HttpStatus.CREATED).json(timeBookDetailDtos);
  }

  @Delete('delete/:id')
  async deleteTimeBook(@Param('id') id: string, @Res() res: Response) {
    const result = await this.timeBookDetailService.deleteByTimeBookId((id));
    if (result) {
      return res.status(HttpStatus.OK).json(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json(result);
    }
  }

  @Patch('update/:id')
  async updateTimeBookForDay(
    @Param('id') id: string,
    @Body() timeBookDetailDto: Partial<TimeBookDetailDto>,
    @Res() res: Response,
  ) {
    try {
      const updatedTimeBookDto = await this.timeBookDetailService.updateByTimeBookId(
        timeBookDetailDto,
        id,
      );
      return res.status(HttpStatus.OK).json(updatedTimeBookDto);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Get('all/')
  async getAllTimeBookingForDay(@Res() res: Response) {
    const timeBookDtoList = await this.timeBookDetailService.getAllTimeBookDetail();
    return res.status(HttpStatus.OK).json(timeBookDtoList);
  }

  @Get('detail/:id')
  async getTimeBookingForDayDetail(@Param('id') id: string, @Res() res: Response) {
    const timeBookDetailDto = await this.timeBookDetailService.getTimeBookingById(id);
    return res.status(HttpStatus.OK).json(timeBookDetailDto);
  }

  @Get('list-time/:day_id')
  async getAllByDayId(@Param('day_id') dayId: string, @Res() res: Response) {
    const timeBookDetailDtos = await this.timeBookDetailService.getAllTimeBookForDayByDayBookId(
      dayId,
    );
    return res.status(HttpStatus.OK).json(timeBookDetailDtos);
  }
}
