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
  wallet_id: string;

  @AutoMap()
  @Column({ name: 'account_number' })
  account_number: string;

  @AutoMap()
  @Column({ name: 'total_money', type: 'decimal' })
  total_money: number;

  @AutoMap()
  @Column({ name: 'bank_name' })
  bank_name: string;

  @AutoMap()
  @Column({ name: 'user_id', type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User)
  @AutoMap(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
