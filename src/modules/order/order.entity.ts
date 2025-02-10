import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TimeBookDetail } from '../timeBookDetail/timeBookDetail.entity';
import { User } from '../users/user.entity';
import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/base.entity';

@Entity({ name: 'orders' })
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  order_id: string;

  @AutoMap()
  @Column({ type: 'timestamp', nullable: true })
  order_date: Date; 

  @AutoMap()
  @Column({ type: 'varchar', nullable: false })
  status_order: string; 

  @AutoMap()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @AutoMap()
  @Column({ type: 'varchar', nullable: true })
  order_id_blockchain: string; 

  @AutoMap()
  @Column({ type: 'varchar', nullable: true })
  public_key: string; 

  @AutoMap()
  @Column({ type: 'uuid', nullable: false })
  time_id: string; 

  @AutoMap()
  @Column({ type: 'uuid', nullable: false })
  user_id: string; 

  @AutoMap(() => TimeBookDetail)
  @ManyToOne(() => TimeBookDetail, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'time_id' })
  time_book_detail: TimeBookDetail;
  
  @AutoMap(() => User)
  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
