import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { TimeBookDetail } from '../time-book-detail/timeBookDetail.entity';
import { Tour } from '../tour/tour.entity';
import { AutoMap } from '@automapper/classes';
import { DayBookStatusEnum } from 'src/utils/enum';
import { BaseEntity } from 'src/base.entity';

@Entity('daybooks')
export class DayBook extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'day_book_id' })
  day_book_id: string; // UUID as the primary key

  @AutoMap()
  @Column({ name: 'date_name', type: 'date', nullable: false })
  date_name: Date; // Represents the date field

  @AutoMap()
  @Column({ name: 'tour_id', type: 'bigint', nullable: false })
  tour_id: number; // Foreign key to the Tour entity

  @AutoMap()
  @Column({ name: 'status', type: 'varchar', nullable: true })
  status: DayBookStatusEnum; // Status field (optional)

  @AutoMap()
  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  is_deleted: boolean; // Boolean for soft delete

  @ManyToOne(() => Tour, (tour) => tour.day_book, {
    cascade: false,
    eager: false,
  })
  @JoinColumn({ name: 'tour_id' })
  @AutoMap(() => Tour)
  tour: Tour; // Many-to-one relation to Tour entity

  @OneToMany(() => TimeBookDetail, (timeBookDetail) => timeBookDetail.day_book)
  @AutoMap(() => [TimeBookDetail])
  time_book_details: TimeBookDetail[]; // One-to-many relation with TimeBookDetail
}
