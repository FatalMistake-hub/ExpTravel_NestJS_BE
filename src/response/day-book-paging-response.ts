import { ApiProperty } from '@nestjs/swagger';
import { DayBookViewDto } from 'src/modules/dayBook/dto/day-book-view.dto';

export class DayBookPagingResponse {
  @ApiProperty({
    description:
      'List of day book view DTOs representing the content of the current page',
    type: [DayBookViewDto],
  })
  content: DayBookViewDto[];

  @ApiProperty({
    description: 'The current page number',
    example: 1,
  })
  pageNo: number;

  @ApiProperty({
    description: 'The size of the page (number of elements per page)',
    example: 10,
  })
  pageSize: number;

  @ApiProperty({
    description: 'The total number of elements across all pages',
    example: 100,
  })
  totalElements: number;

  @ApiProperty({
    description: 'The total number of pages available',
    example: 10,
  })
  totalPages: number;
}
