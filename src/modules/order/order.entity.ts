import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TimeBookDetail } from '../timeBookDetail/timeBookDetail.entity';
import { User } from '../users/user.entity';
import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/base.entity';

@Entity({ name: 'orders' })
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  orderId: string;

  @AutoMap()
  @Column({ type: 'timestamp', nullable: true })
  orderDate: Date;

  @AutoMap()
  @Column({ type: 'varchar', nullable: false })
  statusOrder: string;

  @AutoMap()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @AutoMap()
  @Column({ type: 'varchar', nullable: true })
  orderIdBlockChain: string;

  @AutoMap()
  @Column({ type: 'varchar', nullable: true })
  publicKey: string;

  @AutoMap()
  @Column({ type: 'uuid', nullable: false })
  timeId: string;

  @AutoMap()
  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @AutoMap(() => TimeBookDetail)
  @ManyToOne(() => TimeBookDetail, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'time_id' })
  timeBookDetail: TimeBookDetail;
  
  @AutoMap(() => User)
  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
