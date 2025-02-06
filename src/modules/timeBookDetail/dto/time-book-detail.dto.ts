import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class TimeBookDetailDto {
  @IsUUID()
  @IsOptional()
  timeId?: string = '';

  @Type(() => String)
  @IsNotEmpty()
  startTime: string; // Format: HH:mm:ss (ISO 8601 Time)

  @Type(() => String)
  @IsNotEmpty()
  endTime: string; // Format: HH:mm:ss (ISO 8601 Time)

  @IsBoolean()
  @IsOptional()
  isPayment: boolean = false;

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;

  @IsUUID()
  @IsNotEmpty()
  dayBookId: string;
}
