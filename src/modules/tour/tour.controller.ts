import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { ToursService } from './tour.service';
import { TourCreateDto } from './dto/create-tour.dto';
import { Tour } from './tour.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ViewPortSearchDto } from './dto/view-port-search.dto';
import { TourResponseDto } from './dto/response-tour.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiTags('Tour')
@ApiBearerAuth() // Indicates this controller uses bearer token authentication
@Controller('tour')
export class TourController {
  constructor(
    private readonly tourService: ToursService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new tour' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'Tour created successfully' })
  @ApiBody({ type: TourCreateDto })
  async createTour(@Body() tourDto: TourCreateDto, @Req() request: Request) {
    const userId = request.user?.['userId'];
    await this.tourService.createTour(tourDto, userId);
    return { data: tourDto, statusCode: HttpStatus.CREATED };
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all tours' })
  @ApiResponse({ status: 200, description: 'List of all tours' })
  @ApiQuery({
    name: 'pageNo',
    type: Number,
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'pageSize',
    type: Number,
    required: false,
    description: 'Page size',
  })
  async getAllTour(
    @Query('pageNo', new DefaultValuePipe(1), ParseIntPipe) pageNo: number = 1,
    @Query('pageSize', new DefaultValuePipe(5), ParseIntPipe)
    pageSize: number = 5,
  ): Promise<TourResponseDto> {
    pageSize = pageSize > 100 ? 100 : pageSize;
    return this.tourService.getAll(pageNo, pageSize);
  }

  @Get('search-view-port')
  @ApiOperation({ summary: 'Search tours by viewport' })
  @ApiResponse({ status: 200, description: 'Tours within the viewport' })
  @ApiQuery({
    name: 'pageNo',
    type: Number,
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'pageSize',
    type: Number,
    required: false,
    description: 'Page size',
  })
  @ApiBody({ type: ViewPortSearchDto })
  async searchViewPort(
    @Query('pageNo', new DefaultValuePipe(1), ParseIntPipe) pageNo: number = 1,
    @Query('pageSize', new DefaultValuePipe(5), ParseIntPipe)
    pageSize: number = 5,
    @Body() viewPortSearchDto: ViewPortSearchDto,
  ) {
    pageSize = pageSize > 100 ? 100 : pageSize;
    return this.tourService.getTourViewPort(
      viewPortSearchDto.northEastLat,
      viewPortSearchDto.southWestLat,
      viewPortSearchDto.northEastLng,
      viewPortSearchDto.southWestLng,
      pageNo,
      pageSize,
    );
  }

  @Get(':categoryName/:northEastLat/:northEastLng/:southWestLat/:southWestLng')
  @ApiOperation({ summary: 'Get tours by category name within viewport' })
  @ApiResponse({
    status: 200,
    description: 'Tours filtered by category and viewport',
  })
  @ApiParam({
    name: 'categoryName',
    type: String,
    description: 'Category name',
  })
  @ApiParam({
    name: 'northEastLat',
    type: String,
    description: 'Northeast latitude',
  })
  @ApiParam({
    name: 'northEastLng',
    type: String,
    description: 'Northeast longitude',
  })
  @ApiParam({
    name: 'southWestLat',
    type: String,
    description: 'Southwest latitude',
  })
  @ApiParam({
    name: 'southWestLng',
    type: String,
    description: 'Southwest longitude',
  })
  async getTourByCategoryName(
    @Param('categoryName') categoryName: string,
    @Param('northEastLat') northEastLat: string,
    @Param('northEastLng') northEastLng: string,
    @Param('southWestLat') southWestLat: string,
    @Param('southWestLng') southWestLng: string,
    @Query('pageNo', new DefaultValuePipe(1), ParseIntPipe) pageNo: number = 1,
    @Query('pageSize', new DefaultValuePipe(5), ParseIntPipe)
    pageSize: number = 5,
  ) {
    pageSize = pageSize > 100 ? 100 : pageSize;
    return this.tourService.getTourByCategoryName(
      categoryName,
      pageNo,
      pageSize,
      northEastLat,
      northEastLng,
      southWestLat,
      southWestLng,
    );
  }

  @Get('tour-detail/:tourId')
  @ApiOperation({ summary: 'Get details of a tour by ID' })
  @ApiResponse({ status: 200, description: 'Tour details' })
  @ApiParam({ name: 'tourId', type: Number, description: 'Tour ID' })
  async getTourDetailById(@Param('tourId') tourId: number) {
    return this.tourService.getTourDetail(tourId);
  }

  // @Delete('tour-delete/:id')
  // @ApiOperation({ summary: 'Delete a tour by ID' })
  // @ApiResponse({ status: 204, description: 'Tour deleted successfully' })
  // @ApiParam({ name: 'id', type: Number, description: 'Tour ID' })
  // async deleteTour(@Param('id') id: number) {
  //   await this.tourService.deleteByTourId(id);
  //   return { statusCode: HttpStatus.NO_CONTENT };
  // }

  // @Patch('tour-update/:id')
  // @ApiOperation({ summary: 'Update fields of a tour' })
  // @ApiResponse({ status: 200, description: 'Tour updated successfully' })
  // @ApiParam({ name: 'id', type: Number, description: 'Tour ID' })
  // @ApiBody({ description: 'Fields to update', type: Object })
  // async updateTour(
  //   @Param('id') id: number,
  //   @Body() fields: Record<string, any>,
  // ) {
  //   return this.tourService.updateTourByField(id, fields);
  // }

  // @Patch('tour-update-time/:id')
  // @ApiOperation({ summary: 'Update start and end time of a tour' })
  // @ApiResponse({ status: 200, description: 'Tour times updated successfully' })
  // @ApiParam({ name: 'id', type: Number, description: 'Tour ID' })
  // @ApiBody({ type: UpdateTimeTourDto })
  // async updateStartTimeAndEndTimeTour(
  //   @Param('id') id: number,
  //   @Body() updateTimeTourDto: UpdateTimeTourDto,
  // ) {
  //   await this.tourService.updateTimeTour(updateTimeTourDto, id);
  //   return { message: 'Update Success', statusCode: HttpStatus.OK };
  // }

  // @Get('tour-owner')
  // @ApiOperation({ summary: 'Get tours owned by the current user' })
  // @ApiResponse({ status: 200, description: 'List of tours owned by user' })
  // @ApiQuery({ name: 'pageNo', type: Number, required: false, description: 'Page number' })
  // @ApiQuery({ name: 'pageSize', type: Number, required: false, description: 'Page size' })
  // async getTourByOwner(
  //   @Req() request: Request,
  //   @Query('pageNo') pageNo: number = 1,
  //   @Query('pageSize') pageSize: number = 5,
  // ) {
  //   const token = this.extractToken(request);
  //   const email = this.jwtService.decode(token)['email'];
  //   const userId = await this.tourService.getUserIdByEmail(email);
  //   return this.tourService.getTourByUserId(userId, pageNo, pageSize);
  // }

  // @Post('create-day-time/:tour_id')
  // @ApiOperation({ summary: 'Create day-time slots for a tour' })
  // @ApiResponse({ status: 200, description: 'Day-time slots created successfully' })
  // @ApiParam({ name: 'tour_id', type: Number, description: 'Tour ID' })
  // @ApiBody({ type: DayTimeCreateDto })
  // async createDayTime(
  //   @Body() dayTimeCreateDto: DayTimeCreateDto,
  //   @Param('tour_id') tourId: number,
  // ) {
  //   const startDay = new Date(dayTimeCreateDto.startDay);
  //   const endDay = new Date(dayTimeCreateDto.endDay);
  //   await this.tourService.createDate(startDay, endDay, tourId);
  //   return { message: 'Update Success', statusCode: HttpStatus.OK };
  // }

  // private extractToken(request: Request): string {
  //   const authorization = request.headers['authorization'];
  //   if (!authorization) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  //   return authorization.replace('Bearer ', '');
  // }
}
