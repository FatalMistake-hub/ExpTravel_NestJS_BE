import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, Min } from 'class-validator';
import { GuestType } from 'src/utils/enum';

export class PaymentGuestItemDto {
  @AutoMap()
  @ApiProperty({ enum: GuestType })
  @IsEnum(GuestType, { message: 'guestType must be a valid GuestType enum value' })
  guestType: GuestType;

  @AutoMap()
  @ApiProperty({ example: 1, description: 'Quantity of guests' })
  @IsInt({ message: 'quantity must be an integer' })
  @Min(1, { message: 'quantity must be at least 1' })
  quantity: number;
}
