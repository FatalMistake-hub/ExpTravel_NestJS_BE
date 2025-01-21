import {
   ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { DayBookStatusEnum } from 'src/utils/enum';
import { AutoMap } from '@automapper/classes';

export class DayBookCreateDto {
  @AutoMap()
  @ApiProperty({
    description: 'Unique identifier for the day book',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  dayBookId?: string = null;

  @AutoMap()
  @ApiProperty({
    description: 'The date associated with the day book',
    example: '2025-01-17',
  })
  @IsDate()
  @Type(() => Date)
  dateName: Date;

  @AutoMap()
  @ApiProperty({
    description: 'The status of the day book',
    enum: DayBookStatusEnum,
    default: DayBookStatusEnum.AVAILABLE,
  })
  @IsEnum(DayBookStatusEnum)
  status: DayBookStatusEnum = DayBookStatusEnum.AVAILABLE;

  @AutoMap()
  @ApiProperty({
    description: 'The tour ID associated with this day book',
    example: 123,
  })
  @IsString()
  tourId: number;
}
