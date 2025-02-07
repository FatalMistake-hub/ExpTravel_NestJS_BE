import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './wallet.controller';
import { Wallet } from './wallet.entity';
import { WalletService } from './wallet.service';
import { NativeWalletRepository } from 'src/repository/wallet.reposity';
import { NativeUserRepository } from 'src/repository/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],
  providers: [WalletService, NativeWalletRepository,NativeUserRepository],
  exports: [WalletService, TypeOrmModule.forFeature([Wallet])],
  controllers: [WalletController],
})
export class WalletModule {}
