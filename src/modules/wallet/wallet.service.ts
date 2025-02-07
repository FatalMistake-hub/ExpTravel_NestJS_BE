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
      walletId: uuidv4(),
      accountNumber: walletDto.accountNumber,
      totalMoney: walletDto.totalMoney,
      userId,
      bankName: walletDto.bankName,
    });

    await this.nativeWalletRepository.save(wallet);
  }

  async getWalletByOrderId(orderId: string): Promise<WalletDto> {
    const wallet = await this.nativeWalletRepository.getWalletByOrderId(orderId);

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return {
      walletId: wallet.walletId,
      accountNumber: wallet.accountNumber,
      totalMoney: wallet.totalMoney,
      bankName: wallet.bankName,
    };
  }

  async getWalletByUserId(userId: string): Promise<WalletDto> {
    const wallet = await this.nativeWalletRepository.getWalletByUserId(userId);

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return {
      walletId: wallet.walletId,
      totalMoney: wallet.totalMoney,
      accountNumber: wallet.accountNumber,
      bankName: wallet.bankName,
    };
  }

  async updateWalletByField(id: string, fields: Partial<Wallet>): Promise<void> {
    const wallet = await this.nativeWalletRepository.findOne({ where: { walletId: id } });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    Object.assign(wallet, fields);
    await this.nativeWalletRepository.save(wallet);
  }
}
