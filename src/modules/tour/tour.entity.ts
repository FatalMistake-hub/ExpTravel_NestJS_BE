import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { User } from '../users/user.entity';
import { Category } from '../category/category.entity';
import { ImageDetail } from '../imageDetail/imageDetail.entity';
import { BaseEntity } from 'src/base.entity';
import { AutoMap } from '@automapper/classes';
import { DayBook } from '../dayBook/dayBook.entity';

@Entity('tours')
export class Tour extends BaseEntity {
  @PrimaryGeneratedColumn('identity', { type: 'bigint', name: 'tour_id' })
  // @AutoMap()
  tour_id: number;

  @Column({ name: 'title', nullable: true })
  @IsOptional()
  @IsString()
  @AutoMap()
  title: string;

  @Column({ name: 'rating', nullable: false, type: 'float' })
  @IsNumber()
  @AutoMap()
  rating: number;

  @Column({ name: 'city', nullable: false })
  @IsString()
  @AutoMap()
  city: string;

  @Column({ name: 'price_one_person', nullable: false })
  @AutoMap()
  price_one_person: number;

  @Column({ name: 'image_main', nullable: false })
  @IsString()
  @AutoMap()
  image_main: string;

  @Column({ name: 'working', nullable: false })
  @IsString()
  @AutoMap()
  working: string;

  @Column({ name: 'latitude', nullable: false, type: 'float' })
  @AutoMap()
  latitude: number;

  @Column({ name: 'longitude', nullable: false, type: 'float' })
  @AutoMap()
  longitude: number;

  @Column({ name: 'time_slot_length', nullable: false })
  @AutoMap()
  time_slot_length: number;

  @Column({ name: 'check_in', nullable: false, type: 'timestamp' })
  @AutoMap()
  check_in: Date;

  @Column({ name: 'check_out', nullable: false, type: 'timestamp' })
  @AutoMap()
  check_out: Date;

  // @Column({ name: 'time_book_start', nullable: false, type: 'time' })
  // timeBookStart: string;

  // @Column({ name: 'time_book_end', nullable: false, type: 'time' })
  // timeBookEnd: string;

  @Column({ name: 'destination', nullable: false })
  @AutoMap()
  destination: string;

  @Column({ name: 'destination_description', nullable: false })
  @AutoMap()
  destination_description: string;

  @Column({ name: 'is_deleted', default: false })
  @IsBoolean()
  @AutoMap()
  is_deleted: boolean;

  @Column({ name: 'user_id', nullable: false })
  @IsUUID()
  // @AutoMap()
  user_id: string;

  // Relationship: Many-to-One with User
  @ManyToOne(() => User, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @AutoMap()
  user: User;

  // Relationship: Many-to-Many with Category
  @ManyToMany(() => Category, (category) => category.tours, {
    cascade: true,
    eager: false,
  })
  @JoinTable({
    name: 'tour_category',
    joinColumn: { name: 'tour_id', referencedColumnName: 'tour_id' },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'category_id',
    },
  })
  @AutoMap(() => [Category])
  categories: Category[];

  // Relationship: One-to-Many with ImageDetail
  @OneToMany(() => ImageDetail, (imageDetail) => imageDetail.tour, {
    cascade: true,
    eager: true,
  })
  @AutoMap(() => [ImageDetail])
  image_details: ImageDetail[];

  @OneToMany(() => ImageDetail, (imageDetail) => imageDetail.tour, {
    cascade: true,
    eager: true,
  })
  @AutoMap(() => [DayBook])
  day_book: DayBook[];

  [key: string]: any;
}
