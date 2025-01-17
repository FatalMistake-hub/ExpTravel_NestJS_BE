export class DaybookviewDto {}
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { TimeBookViewDto } from 'src/modules/time-book-detail/dto/time-book-view.dto';
import { DayBookStatusEnum } from 'src/utils/enum';


export class DayBookViewDto {
  @ApiProperty({
    description: 'Unique identifier for the day book',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  dayBookId: string;

  @ApiProperty({
    description: 'The date associated with the day book (formatted as a string)',
    example: '2025-01-17',
  })
  @IsString()
  date_name: string;

  @ApiProperty({
    description: 'The tour ID associated with this day book',
    example: 123,
  })
  @IsString()
  tourId: string;

  @ApiProperty({
    description: 'The status of the day book',
    enum: DayBookStatusEnum,
    default: DayBookStatusEnum.AVAILABLE,
  })
  @IsEnum(DayBookStatusEnum)
  status: DayBookStatusEnum = DayBookStatusEnum.AVAILABLE;

  @ApiProperty({
    description: 'Flag indicating whether the day book is deleted',
    example: false,
  })
  @IsBoolean()
  isDeleted: boolean;

  @ApiProperty({
    description: 'List of associated time book details',
    type: [TimeBookViewDto],
  })
  @IsOptional()
  timeBookDetailList: TimeBookViewDto[];
}
