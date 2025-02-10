import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/base.entity';
import { PaymentStatus } from 'src/utils/enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimeBookDetail } from '../timeBookDetail/timeBookDetail.entity';
import { User } from '../users/user.entity';

@Entity({ name: 'payments' })
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'payment_id' })
  payment_id: string;

  @AutoMap()
  @Column({ name: 'vnp_order_info', nullable: true })
  vnp_order_info: string;

  @AutoMap()
  @Column({ name: 'order_type', nullable: true })
  order_type: string;

  @AutoMap()
  @Column({ type: 'decimal', nullable: false })
  amount: number;

  @AutoMap()
  @Column({ nullable: false })
  locate: string;

  @AutoMap()
  @Column({ name: 'ip_address', nullable: false })
  ip_address: string;

  @AutoMap()
  @Column({ name: 'payment_url', nullable: true })
  payment_url: string;

  @AutoMap()
  @Column({ type: 'enum', enum: PaymentStatus, nullable: true })
  status: PaymentStatus;

  @AutoMap()
  @Column({ name: 'time_over', type: 'timestamp', nullable: false })
  time_over: Date;
  
  @AutoMap()
  @Column({ name: 'tnx_ref', nullable: false })
  txn_ref: string; 

  @AutoMap()
  @Column({ name: 'time_id', type: 'uuid', nullable: false })
  time_id: string;

  @AutoMap()
  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  @AutoMap(() => User)
  user: User;

  @ManyToOne(() => TimeBookDetail)
  @JoinColumn({ name: 'time_id' })
  @AutoMap(() => TimeBookDetail)
  time_book_detail: TimeBookDetail;
}
