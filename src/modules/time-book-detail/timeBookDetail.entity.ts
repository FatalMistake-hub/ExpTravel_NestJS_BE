import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DayBook } from '../dayBook/dayBook.entity';
import { BaseEntity } from 'src/base.entity';


@Entity('time_book_details')
export class TimeBookDetail extends BaseEntity{
  @PrimaryGeneratedColumn('uuid', { name: 'time_id' })
  time_id: string; // UUID for the primary key

  @Column({ name: 'start_time', type: 'time without time zone', nullable: false })
  start_time: string; // Represents time as 'HH:mm:ss'

  @Column({ name: 'end_time', type: 'time without time zone', nullable: false })
  end_time: string; // Represents time as 'HH:mm:ss'

  @Column({ name: 'day_book_id', type: 'uuid', nullable: false })
  day_book_id: string; // Foreign key as UUID

  @Column({ name: 'is_payment', type: 'boolean', default: false })
  is_payment: boolean; // Boolean for payment status

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  is_deleted: boolean; // Boolean for soft delete

  @ManyToOne(() => DayBook, (dayBook) => dayBook.time_book_details, { cascade: true, eager: false })
  @JoinColumn({ name: 'day_book_id' })
  day_book: DayBook; // Relation to DayBook entity
}
