export class DaybookDto {}
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { DayBookStatusEnum } from 'src/utils/enum';

export class DayBookDto {
  @ApiProperty({
    description: 'Unique identifier for the day book',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  dayBookId: string;

  @ApiProperty({
    description: 'Date name for the day book in string format',
    example: '2025-01-17',
  })
  @IsString()
  dateName: string;

  @ApiProperty({
    description: 'ID of the associated tour',
    example: 12345,
  })
  @IsString()
  tourId: number;

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
}
