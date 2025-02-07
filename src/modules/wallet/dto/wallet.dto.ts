import { AutoMap } from '@automapper/classes';
import { IsUUID, IsString, IsNumber, IsOptional } from 'class-validator';

export class WalletDto {
  @AutoMap()
  @IsUUID()
  @IsOptional()
  walletId?: string;

  @AutoMap()
  @IsString()
  accountNumber: string;

  @AutoMap()
  @IsNumber()
  totalMoney: number;

  @AutoMap()
  @IsString()
  bankName: string;
}
