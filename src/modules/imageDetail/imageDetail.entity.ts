import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { Tour } from '../tour/tour.entity';

@Entity('image_details')
export class ImageDetail extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  imageId: string; // UUID is mapped to a string in TypeORM

  @Column({ name: 'link', nullable: false })
  @IsNotEmpty()
  @IsString()
  link: string;

  @Column({ name: 'tour_id', nullable: false })
  @IsNumber()
  tourId: number;

  // Many-to-One relationship with Tour
  @ManyToOne(() => Tour, (tour) => tour.imageDetails, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tour_id' })
  tour: Tour;
}
