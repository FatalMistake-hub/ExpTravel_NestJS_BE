import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

export class OrderDetailDto {
  @AutoMap()
  @ApiProperty({ example: uuidv4(), description: 'Unique order ID' })
  orderId: string = uuidv4();

  @AutoMap()
  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Order creation date',
  })
  orderDate: Date;

  @AutoMap()
  @ApiProperty({
    example: 'SUCCESS',
    description: 'Current status of the order',
  })
  statusOrder: string;

  @AutoMap()
  @ApiProperty({ example: 250.75, description: 'Total order price' })
  price: number;

  @AutoMap()
  @ApiProperty({
    example: 'Paris Sightseeing Tour',
    description: 'Title of the tour',
  })
  @IsOptional()
  tourTitle?: string;

  @AutoMap()
  @ApiProperty({
    example: 'blockchain_67890',
    description: 'Blockchain Order ID',
  })
  orderIdBlockChain: string;

  @AutoMap()
  @ApiProperty({
    example: 'public_key_67890',
    description: 'Public key for blockchain verification',
  })
  publicKey: string;

  @IsOptional()
  @AutoMap()
  @ApiProperty({ example: 'Paris', description: 'City of the tour' })
  city?: string;

  @AutoMap()
  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Main image URL for the order',
  })
  @IsOptional()
  imageMain?: string;

  @AutoMap()
  @IsOptional()
  @ApiProperty({ example: 50.0, description: 'Price per person' })
  priceOnePerson?: number;

  @AutoMap()
  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Booking date',
  })
  @IsOptional()
  dateName?: Date;
}
