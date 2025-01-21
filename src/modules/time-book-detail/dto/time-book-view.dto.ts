import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { TimeBookDetail } from '../timeBookDetail.entity';

export class TimeBookViewDto {
  @ApiProperty({
    description: 'Unique identifier for the time book detail',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  timeId: string;

  @ApiProperty({
    description: 'Start time for the booking',
    example: '10:00:00',
  })
  @IsString()
  startTime: string;

  @ApiProperty({
    description: 'End time for the booking',
    example: '12:00:00',
  })
  @IsString()
  endTime: string;

  @ApiProperty({
    description: 'Flag indicating whether the time book detail is deleted',
    example: false,
  })
  @IsBoolean()
  isDeleted: boolean;
  constructor(partial: Partial<TimeBookDetail>) {
    this.timeId = partial.time_id;
    this.startTime = partial.start_time;
    this.endTime = partial.end_time;
    this.isDeleted = partial.is_deleted;
  }
}
