import { BaseEntity } from 'src/base.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tour } from '../tour/tour.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  categoryId: number; // You can use number instead of Long for auto-incrementing IDs in NestJS

  @Column({ name: 'category_name', nullable: false })
  categoryName: string;

  @Column({ name: 'image_link', nullable: false })
  imageLink: string;

  @ManyToMany(() => Tour, (tour) => tour.categories,
    {
    cascade: ['insert', 'update'],
    eager: false, // Lazy loading equivalent
    }
  )
  tours: Tour[];

  constructor(categoryId?: number, categoryName?: string, imageLink?: string) {
    super(); // Assuming BaseEntity has the constructor logic if required
    this.categoryId = categoryId;
    this.categoryName = categoryName;
    this.imageLink = imageLink;
  }
}
