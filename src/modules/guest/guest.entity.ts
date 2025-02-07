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
  guestId: string;

  @AutoMap()
  @Column({ name: 'guest_type' })
  guestType: string;

  @AutoMap()
  @Column({ name: 'quantity' })
  quantity: number;

  @AutoMap()
  @Column({ name: 'time_id' })
  timeId: string;

  @AutoMap()
  @Column({ name: 'user_id' })
  userId: string;

  @AutoMap()
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @AutoMap()
  @ManyToOne(() => TimeBookDetail, {
    eager: false,
  })
  @JoinColumn({ name: 'time_id' })
  timeBookDetail: TimeBookDetail;
}
