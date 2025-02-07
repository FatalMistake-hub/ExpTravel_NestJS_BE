import { Injectable } from '@nestjs/common';
import { Wallet } from 'src/modules/wallet/wallet.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class NativeWalletRepository extends Repository<Wallet> {
  constructor(private readonly dataSource: DataSource) {
    super(Wallet, dataSource.createEntityManager());
  }

  async getWalletByOrderId(orderId: string): Promise<Wallet | null> {
    const query = `
      SELECT * FROM wallets AS w
      INNER JOIN users AS u ON u.user_id = w.user_id
      INNER JOIN orders AS o ON o.user_id = u.user_id
      WHERE o.order_id = $1
    `;
    const result = await this.dataSource.query(query, [orderId]);
    return result.length ? result[0] : null;
  }

  async updateTotalMoney(walletId: string, totalMoney: number): Promise<void> {
    const query = `
      UPDATE wallets
      SET total_money = $1
      WHERE wallet_id = $2
    `;
    await this.dataSource.query(query, [totalMoney, walletId]);
  }

  async getWalletByUserId(userId: string): Promise<Wallet | null> {
    const query = `
      SELECT * FROM wallets
      WHERE user_id = $1
    `;
    const result = await this.dataSource.query(query, [userId]);
    return result.length ? result[0] : null;
  }
}
