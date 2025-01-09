import { BaseEntity } from 'src/base.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tour } from '../tour/tour.entity';
import { AutoMap } from '@automapper/classes';

@Entity('categories')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'category_id' })
  @AutoMap()
  category_id: number; // You can use number instead of Long for auto-incrementing IDs in NestJS

  @AutoMap()
  @Column({ name: 'category_name', nullable: false })
  category_name: string;

  @AutoMap()
  @Column({ name: 'image_link', nullable: false })
  image_link: string;

  @ManyToMany(() => Tour, (tour) => tour.categories, {
    cascade: ['insert', 'update'],
    eager: false, // Lazy loading equivalent
  })
  tours: Tour[];

  [key: string]: any;
  constructor(categoryId?: number, categoryName?: string, imageLink?: string) {
    super(); // Assuming BaseEntity has the constructor logic if required
    this.category_id = categoryId;
    this.category_name = categoryName;
    this.image_link = imageLink;
  }
}
