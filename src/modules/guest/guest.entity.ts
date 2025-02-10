import { AutoMap } from '@automapper/classes';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { TimeBookDetail } from '../timeBookDetail/timeBookDetail.entity';
import { BaseEntity } from 'src/base.entity';


@Entity({ name: 'guests' })
export class Guest extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid', { name: 'guest_id' })
  guest_id: string;

  @AutoMap()
  @Column({ name: 'guest_type' })
  guest_type: string;

  @AutoMap()
  @Column({ name: 'quantity' })
  quantity: number;

  @AutoMap()
  @Column({ name: 'time_id' })
  time_id: string;

  @AutoMap()
  @Column({ name: 'user_id' })
  user_id: string;

  @AutoMap()
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @AutoMap()
  @ManyToOne(() => TimeBookDetail, {
    eager: false,
  })
  @JoinColumn({ name: 'time_id' })
  time_book_detail: TimeBookDetail;
}
