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

@Entity('tours')
export class Tour extends BaseEntity {
  @PrimaryGeneratedColumn('identity', { type: 'bigint' ,name: 'tour_id'})
  tour_id: number;

  @Column({ name: 'title', nullable: true })
  @IsOptional()
  @IsString()
  title: string;

  @Column({ name: 'rating', nullable: false , type: "float"})
  @IsNumber()
  rating: number;

  @Column({ name: 'city', nullable: false })
  @IsString()
  city: string;

  @Column({ name: 'price_one_person', nullable: false })
  price_one_person: number;

  @Column({ name: 'image_main', nullable: false })
  @IsString()
  image_main: string;

  @Column({ name: 'working', nullable: false })
  @IsString()
  working: string;

  @Column({ name: 'latitude', nullable: false, type:"float" })
  latitude: number;

  @Column({ name: 'longitude', nullable: false , type:"float"})
  longitude: number;

  @Column({ name: 'time_slot_length', nullable: false })
  time_slot_length: number;

  @Column({ name: 'check_in', nullable: false, type: 'timestamp' })
  check_in: Date;

  @Column({ name: 'check_out', nullable: false, type: 'timestamp' })
  check_out: Date;

  // @Column({ name: 'time_book_start', nullable: false, type: 'time' })
  // timeBookStart: string;

  // @Column({ name: 'time_book_end', nullable: false, type: 'time' })
  // timeBookEnd: string;

  @Column({ name: 'destination', nullable: false })
  destination: string;

  @Column({ name: 'destination_description', nullable: false })
  destination_description: string;

  @Column({ name: 'is_deleted', default: false })
  @IsBoolean()
  is_deleted: boolean;

  @Column({ name: 'user_id', nullable: false })
  @IsUUID()
  user_id: string;

  // Relationship: Many-to-One with User
  @ManyToOne(() => User, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Relationship: Many-to-Many with Category
  @ManyToMany(() => Category, (category) => category.tours, {
    cascade: true,
    eager: false,
  })
  @JoinTable({
    name: 'tour_category',
    joinColumn: { name: 'tour_id', referencedColumnName: 'tour_id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'category_id' },
  })
  categories: Category[];

  // Relationship: One-to-Many with ImageDetail
  @OneToMany(() => ImageDetail, (imageDetail) => imageDetail.tour, { cascade: true, eager: true })
  image_details: ImageDetail[];

  [key: string]: any;
}
