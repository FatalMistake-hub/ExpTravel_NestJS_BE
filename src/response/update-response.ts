import { ApiProperty } from '@nestjs/swagger';

export class UpdateResponse {
  @ApiProperty({
    description: 'Message providing additional information about the update',
    example: 'UPDATED SUCCESS',
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code indicating the outcome of the operation',
    example: '200',
  })
  status_code: string;
}
