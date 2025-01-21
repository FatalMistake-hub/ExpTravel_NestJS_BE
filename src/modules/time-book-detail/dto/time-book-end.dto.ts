import { IsInt, Min, Max } from 'class-validator';

export class TimeBookEndDto {
  @IsInt()
  @Min(0)
  @Max(23)
  hour: number;

  @IsInt()
  @Min(0)
  @Max(59)
  minutes: number;

  constructor(hour: number, minutes: number) {
    this.hour = hour;
    this.minutes = minutes;
  }
}
