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
  paymentId: string;

  @AutoMap()
  @Column({ name: 'vnp_order_info', nullable: true })
  vnpOrderInfo: string;

  @AutoMap()
  @Column({ name: 'order_type', nullable: true })
  orderType: string;

  @AutoMap()
  @Column({ type: 'decimal', nullable: false })
  amount: number;

  @AutoMap()
  @Column({ nullable: false })
  locate: string;

  @AutoMap()
  @Column({ name: 'ip_address', nullable: false })
  ipAddress: string;

  @AutoMap()
  @Column({ name: 'payment_url', nullable: true })
  paymentUrl: string;

  @AutoMap()
  @Column({ type: 'enum', enum: PaymentStatus, nullable: true })
  status: PaymentStatus;

  @AutoMap()
  @Column({ name: 'tnx_ref', nullable: false })
  txnRef: string;

  @AutoMap()
  @Column({ name: 'time_over', type: 'timestamp', nullable: false })
  timeOver: Date;

  @AutoMap()
  @Column({ name: 'time_id', type: 'uuid', nullable: false })
  timeId: string;

  @AutoMap()
  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  @AutoMap(() => User)
  user: User;

  @ManyToOne(() => TimeBookDetail)
  @JoinColumn({ name: 'time_id' })
  @AutoMap(() => TimeBookDetail)
  timeBookDetail: TimeBookDetail;
}
