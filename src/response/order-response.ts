import { ApiProperty } from '@nestjs/swagger';
import { OrderDto } from 'src/modules/order/dto/order.dto';

export class OrderResponse {
  @ApiProperty({ type: [OrderDto], description: 'List of orders' })
  content: OrderDto[];

  @ApiProperty({ example: 1, description: 'Current page number' })
  pageNo: number;

  @ApiProperty({ example: 10, description: 'Number of items per page' })
  pageSize: number;

  @ApiProperty({ example: 100, description: 'Total number of elements' })
  totalElements: number;

  @ApiProperty({ example: 10, description: 'Total number of pages' })
  totalPages: number;

  constructor(content: OrderDto[], pageNo: number, pageSize: number, totalElements: number) {
    this.content = content;
    this.pageNo = pageNo;
    this.pageSize = pageSize;
    this.totalElements = totalElements;
    this.totalPages = Math.ceil(totalElements / pageSize);
  }
}
