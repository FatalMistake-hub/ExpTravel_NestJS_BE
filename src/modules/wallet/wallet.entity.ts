import { AutoMap } from '@automapper/classes';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { BaseEntity } from 'src/base.entity';

@Entity('wallets')
export class Wallet extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  walletId: string;

  @AutoMap()
  @Column({ name: 'account_number' })
  accountNumber: string;

  @AutoMap()
  @Column({ name: 'total_money', type: 'decimal' })
  totalMoney: number;

  @AutoMap()
  @Column({ name: 'bank_name' })
  bankName: string;

  @AutoMap()
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  @AutoMap(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
