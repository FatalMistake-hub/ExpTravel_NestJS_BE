import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NativeWalletRepository } from 'src/repository/wallet.reposity';
import { v4 as uuidv4 } from 'uuid';
import { WalletDto } from './dto/wallet.dto';
import { Wallet } from './wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly nativeWalletRepository: NativeWalletRepository,
  ) {}

  async createWallet(walletDto: WalletDto, userId: string): Promise<void> {
    const wallet = this.nativeWalletRepository.create({
      wallet_id: uuidv4(),
      account_number: walletDto.accountNumber,
      total_money: walletDto.totalMoney,
      user_id: userId,
      bank_name: walletDto.bankName,
    });

    await this.nativeWalletRepository.save(wallet);
  }

  async getWalletByOrderId(orderId: string): Promise<WalletDto> {
    const wallet = await this.nativeWalletRepository.getWalletByOrderId(orderId);

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return {
      walletId: wallet.wallet_id,
      accountNumber: wallet.account_number,
      totalMoney: wallet.total_money,
      bankName: wallet.bank_name,
    };
  }

  async getWalletByUserId(userId: string): Promise<WalletDto> {
    const wallet = await this.nativeWalletRepository.getWalletByUserId(userId);

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return {
      walletId: wallet.wallet_id,
      totalMoney: wallet.total_money,
      accountNumber: wallet.account_number,
      bankName: wallet.bank_name,
    };
  }

  async updateWalletByField(id: string, fields: Partial<Wallet>): Promise<void> {
    const wallet = await this.nativeWalletRepository.findOne({ where: { wallet_id: id } });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    Object.assign(wallet, fields);
    await this.nativeWalletRepository.save(wallet);
  }
}
