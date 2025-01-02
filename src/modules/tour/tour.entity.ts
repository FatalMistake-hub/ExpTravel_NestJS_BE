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
  @PrimaryGeneratedColumn('identity', { type: 'bigint' })
  tourId: number;

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
  priceOnePerson: number;

  @Column({ name: 'image_main', nullable: false })
  @IsString()
  imageMain: string;

  @Column({ name: 'working', nullable: false })
  @IsString()
  working: string;

  @Column({ name: 'latitude', nullable: false, type:"float" })
  latitude: number;

  @Column({ name: 'longitude', nullable: false , type:"float"})
  longitude: number;

  @Column({ name: 'time_slot_length', nullable: false })
  timeSlotLength: number;

  @Column({ name: 'check_in', nullable: false, type: 'timestamp' })
  checkIn: Date;

  @Column({ name: 'check_out', nullable: false, type: 'timestamp' })
  checkOut: Date;

  // @Column({ name: 'time_book_start', nullable: false, type: 'time' })
  // timeBookStart: string;

  // @Column({ name: 'time_book_end', nullable: false, type: 'time' })
  // timeBookEnd: string;

  @Column({ name: 'destination', nullable: false })
  destination: string;

  @Column({ name: 'destination_description', nullable: false })
  destinationDescription: string;

  @Column({ name: 'is_deleted', default: false })
  @IsBoolean()
  isDeleted: boolean;

  @Column({ name: 'user_id', nullable: false })
  @IsUUID()
  userId: string;

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
  })
  categories: Category[];

  // Relationship: One-to-Many with ImageDetail
  @OneToMany(() => ImageDetail, (imageDetail) => imageDetail.tour, { cascade: true, eager: true })
  imageDetails: ImageDetail[];
}
