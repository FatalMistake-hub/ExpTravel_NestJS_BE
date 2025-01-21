import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ImageDto } from 'src/modules/imageDetail/dto/image.dto';
import { CategoryDto } from 'src/modules/category/dto/category.dto';
import { AutoMap } from '@automapper/classes';
import { TimeBookStartDto } from 'src/modules/time-book-detail/dto/time-book-start.dto';
import { TimeBookEndDto } from 'src/modules/time-book-detail/dto/time-book-end.dto';

export class TourCreateDto {
  // @ApiProperty({ description: 'Tour ID', example: 1, required: false })
  // @IsOptional()
  // @IsNumber()
  // tourId?: number;

  @ApiProperty({ description: 'Title of the tour', example: 'Amazing Tour' })
  @IsNotEmpty({ message: 'Vui lòng nhập tiêu đề!' })
  @IsString()
  @AutoMap()
  title: string;

  @ApiProperty({
    description: 'Rating of the tour',
    example: 4.5,
    required: false,
  })
  @IsNumber()
  @AutoMap()
  rating?: number;

  @ApiProperty({
    description: 'City where the tour takes place',
    example: 'Hanoi',
  })
  @IsNotEmpty({ message: 'Vui lòng nhập tên thành phố!' })
  @IsString()
  @AutoMap()
  city: string;

  @ApiProperty({ description: 'Price for one person', example: 100 })
  @IsNotEmpty({ message: 'Vui lòng nhập giá!' })
  @IsNumber()
  @AutoMap()
  priceOnePerson: number;

  @ApiProperty({
    description: 'Main image URL',
    example: 'http://example.com/image.jpg',
  })
  @IsNotEmpty({ message: 'Vui lòng nhập url ảnh!' })
  @IsString()
  @AutoMap()
  imageMain: string;

  @ApiProperty({
    description: 'Working details of the tour',
    example: 'Guided tour through the city',
  })
  @IsNotEmpty({ message: 'Vui lòng nhập công việc sẽ thực hiện!' })
  @IsString()
  @AutoMap()
  working: string;

  @ApiProperty({
    description: 'Latitude of the tour location',
    example: '21.028511',
  })
  @IsNotEmpty({ message: 'Vui lòng nhập vĩ độ!' })
  @IsString()
  @AutoMap()
  latitude: string;

  @ApiProperty({
    description: 'Longitude of the tour location',
    example: '105.804817',
  })
  @IsNotEmpty({ message: 'Vui lòng nhập kinh độ!' })
  @IsString()
  @AutoMap()
  longitude: string;

  @ApiProperty({
    description: 'Destination details',
    example: 'Famous landmark',
  })
  @IsString()
  @AutoMap()
  destination?: string;

  @ApiProperty({ description: 'Check-in time', example: '2023-12-25 10:00:00' })
  @IsString()
  @IsOptional()
  @AutoMap()
  checkIn?: string;

  @ApiProperty({
    description: 'Check-out time',
    example: '2023-12-25 18:00:00',
  })
  @IsString()
  @IsOptional()
  @AutoMap()
  checkOut?: string;

  @ApiProperty({
    description: 'Description of the destination',
    example: 'A beautiful place to visit.',
  })
  @IsNotEmpty({ message: 'Vui lòng nhập mô tả chi tiết!' })
  @IsString()
  @AutoMap()
  destinationDescription: string;

  @ApiProperty({ description: 'Time slot length in minutes', example: 60 })
  @IsNotEmpty({ message: 'Vui lòng nhập khoảng thời gian!' })
  @IsNumber()
  @AutoMap()
  timeSlotLength: number;

  @ApiProperty({ description: 'Categories of the tour', type: [CategoryDto] })
  @IsNotEmpty({ message: 'Vui lòng chọn danh mục!' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryDto)
  @AutoMap(() => [CategoryDto])
  categories: CategoryDto[];

  @ApiProperty({ description: 'List of images for the tour', type: [ImageDto] })
  // @IsNotEmpty({ message: 'Vui lòng nhập danh sách ảnh!' })
  @IsOptional()
  @IsArray()
  // @ValidateNested({ each: true })
  @Type(() => ImageDto)
  @AutoMap(() => [ImageDto])
  imageDtoList?: ImageDto[];

  @ApiProperty({
    description: 'Start date of the tour',
    example: '2023-12-25T10:00:00Z',
  })
  @IsNotEmpty({ message: 'Vui lòng nhập ngày bắt đầu hành trình!' })
  @IsString()
  @AutoMap()
  startDay: string;

  @ApiProperty({
    description: 'End date of the tour',
    example: '2023-12-30T18:00:00Z',
  })
  @IsNotEmpty({ message: 'Vui lòng nhập ngày kết thúc hành trình!' })
  @IsString()
  @AutoMap()
  endDay: string;

  @ApiProperty({
    description: 'Start time slot for bookings',
    type: TimeBookStartDto,
  })
  @IsNotEmpty({ message: 'Vui lòng nhập thời khung thời gian bắt đầu!' })
  @ValidateNested()
  @Type(() => TimeBookStartDto)
  timeBookStart: TimeBookStartDto;

  @ApiProperty({
    description: 'End time slot for bookings',
    type: TimeBookEndDto,
  })
  @IsNotEmpty({ message: 'Vui lòng nhập khung thời gian kết thúc!' })
  @ValidateNested()
  @Type(() => TimeBookEndDto)
  timeBookEnd: TimeBookEndDto;

  @ApiProperty({
    description: 'User ID of the creator',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @IsUUID()
  @IsOptional()
  @AutoMap()
  userId?: string;
}
