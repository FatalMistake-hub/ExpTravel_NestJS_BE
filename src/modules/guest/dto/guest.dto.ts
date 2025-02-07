import { AutoMap } from '@automapper/classes';
import { IsUUID, IsString, IsInt, IsOptional } from 'class-validator';

export class GuestDto {
  @AutoMap()
  @IsUUID()
  @IsOptional()
  guestId?: string;

  @AutoMap()
  @IsString()
  guestType: string;

  @AutoMap()
  @IsInt()
  quantity: number;

  @AutoMap()
  @IsUUID()
  @IsOptional()
  timeId?: string;

  @AutoMap()
  @IsUUID()
  @IsOptional()
  userId?: string;
}
