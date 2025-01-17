import { ApiProperty } from '@nestjs/swagger';
import { DayBookDto } from 'src/modules/dayBook/dto/day-book.dto';

export class DayPagingResponse {
  @ApiProperty({
    description:
      'List of day book DTOs representing the content of the current page',
    type: [DayBookDto],
  })
  content: DayBookDto[];

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
