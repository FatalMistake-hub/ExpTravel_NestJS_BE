import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

import {
  IsUUID,
  IsString,
  IsNumber,
  IsOptional,
  IsDate,
} from 'class-validator';
import { TimeBookViewDto } from 'src/modules/timeBookDetail/dto/time-book-view.dto';
import { UserViewDto } from 'src/modules/users/dto/user-view.dto';

export class OrderDto {
  @ApiProperty({ description: 'Unique identifier for the order' })
  @IsUUID()
  @AutoMap()
  orderId: string = crypto.randomUUID();

  @ApiProperty({ description: 'Order date' })
  @IsDate()
  @AutoMap()
  orderDate: Date;

  @ApiProperty({ description: 'Status of the order' })
  @IsString()
  @AutoMap()
  statusOrder: string;

  @ApiProperty({ description: 'Price of the order' })
  @IsNumber()
  @AutoMap()
  price: number;

  @ApiProperty({ description: 'Title of the tour' })
  @IsString()
  @IsOptional()
  @AutoMap()
  tour_title?: string;

  @ApiProperty({ description: 'Blockchain Order ID' })
  @IsOptional()
  @IsString()
  @AutoMap()
  orderIdBlockChain?: string;

  @ApiProperty({ description: 'Public key for authorization' })
  @IsOptional()
  @IsString()
  @AutoMap()
  publicKey?: string;

  @ApiProperty({ description: 'City where the tour is located' })
  @IsString()
  @IsOptional()
  @AutoMap()
  city?: string;

  @ApiProperty({ description: 'Main image of the tour' })
  @IsString()
  @AutoMap()
  @IsOptional()
  imageMain?: string;

  @ApiProperty({ description: 'Price per person' })
  @IsNumber()
  @AutoMap()
  @IsOptional()
  priceOnePerson?: number;

  @ApiProperty({ description: 'Date name' })
  @IsDate()
  @IsOptional()
  @AutoMap()
  date_name?: Date;

  @ApiProperty({ description: 'Time ID related to the booking' })
  @IsUUID()
  @IsOptional()
  @AutoMap()
  timeId?: string;

  @ApiProperty({ description: 'User ID of the customer' })
  @IsUUID()
  @AutoMap()
  userId: string;

  @AutoMap()
  @ApiProperty({
    description: 'Details about the time booking',
    type: () => TimeBookViewDto,
  })
  @IsOptional()
  timeBookViewDto?: TimeBookViewDto;

  @AutoMap()
  @ApiProperty({ description: 'Tour ID related to the order' })
  @IsNumber()
  tourId: number;

  @AutoMap()
  @ApiProperty({ description: 'User details', type: () => UserViewDto })
  @IsOptional()
  user?: UserViewDto;
}
