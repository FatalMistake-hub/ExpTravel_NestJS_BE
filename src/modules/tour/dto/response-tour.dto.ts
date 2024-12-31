import { IsArray, IsInt } from 'class-validator';
import { TourViewDto } from './tour-view.dto'; // Adjust path

export class TourResponseDto {
  @IsArray()
  content: TourViewDto[];

  @IsInt()
  pageNo: number;

  @IsInt()
  pageSize: number;

  @IsInt()
  totalElements: number;

  @IsInt()
  totalPages: number;
}
