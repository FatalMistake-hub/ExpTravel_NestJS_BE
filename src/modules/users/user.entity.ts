import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier for the user',
  })
  userId: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Unique username for the user',
  })
  @Column({ unique: true, length: 30 })
  userName: string;

  @ApiProperty({
    example: 'john_doe@gmail.com',
    description: 'Email address of the user',
  })
  @Column({ unique: true })
  userEmail: string;

  @ApiProperty({
    example: 'A passionate developer.',
    description: 'Short description about the user',
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    example: '123 Main St, Springfield',
    description: 'Residential address of the user',
  })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the user has a wallet',
  })
  @Column({ default: false })
  isWallet: boolean;

  @ApiProperty({
    example: '+123456789',
    description: 'Contact phone number of the user',
  })
  @Column({ nullable: true })
  phoneNumber: string;

  @ApiProperty({
    example: 'en',
    description: 'Preferred language of the user',
  })
  @Column({ nullable: true })
  language: string;

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    description: 'URL of the user profile image',
  })
  @Column({ nullable: true })
  urlImage: string;

  @ApiProperty({
    description: 'Password of the user',
  })
  @Column()
  @Exclude()
  userPassword: string;

  @ApiProperty({
    example: 'USER',
    description: 'Role of the user',
  })
  @Column({ default: 'USER' })
  role: string;

  @ApiProperty({
    example: 'AuthorizedAccount',
    description: 'Additional authorization information',
  })
  @Column({ nullable: true })
  accountAuthorize: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the user account is enabled',
  })
  @Column({ default: true })
  isEnabled: boolean;
}
