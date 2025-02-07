import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, Min } from 'class-validator';
import { GuestType } from 'src/utils/enum';

export class PricePaymentDto {
  @AutoMap()
  @ApiProperty({ example: 100.5, description: 'Price per person' })
  @IsNumber({}, { message: 'priceOnePerson must be a number' })
  priceOnePerson: number;

  @AutoMap()
  @ApiProperty({ enum: GuestType, description: 'Type of guest' })
  @IsEnum(GuestType, { message: 'guestType must be a valid GuestType enum value' })
  guestType: GuestType;

  @AutoMap()
  @ApiProperty({ example: 1, description: 'Quantity of guests' })
  @IsInt({ message: 'quantity must be an integer' })
  @Min(1, { message: 'quantity must be at least 1' })
  quantity: number;
}
