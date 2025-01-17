import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { DayBookStatusEnum } from 'src/utils/enum';

export class DateBookCreateDto {
  @ApiProperty({
    description: 'Unique identifier for the day book',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  day_book_id?: string = null;

  @ApiProperty({
    description: 'The date associated with the day book',
    example: '2025-01-17',
  })
  @IsDate()
  @Type(() => Date)
  date_name: Date;

  @ApiProperty({
    description: 'The status of the day book',
    enum: DayBookStatusEnum,
    default: DayBookStatusEnum.AVAILABLE,
  })
  @IsEnum(DayBookStatusEnum)
  status: DayBookStatusEnum = DayBookStatusEnum.AVAILABLE;

  @ApiProperty({
    description: 'The tour ID associated with this day book',
    example: 123,
  })
  @IsString()
  tour_id: string;
}
