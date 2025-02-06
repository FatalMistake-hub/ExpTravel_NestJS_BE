import {
  IsUUID,
  IsDate,
  IsOptional,
  IsString,
  IsBoolean,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DayBookStatusEnum } from 'src/utils/enum';
import { TimeBookDetail } from 'src/modules/timeBookDetail/timeBookDetail.entity';
import { AutoMap } from '@automapper/classes';

export class DayBookUpdate {
  @IsUUID()
  @AutoMap()
  dayBookId: string;

  @IsDate()
  @AutoMap()
  @Type(() => Date)
  dateName: Date;

  @IsOptional()
  @IsString()
  @AutoMap()
  tourId: number;

  @IsOptional()
  @IsString()
  @AutoMap()
  status: string = DayBookStatusEnum.AVAILABLE;

  @IsOptional()
  @IsBoolean()
  @AutoMap()
  isDeleted: boolean;

  @IsOptional()
  @IsArray()
  @AutoMap()
  @ValidateNested({ each: true })
  @Type(() => TimeBookDetail)
  timeBookDetailList?: TimeBookDetail[];
}
