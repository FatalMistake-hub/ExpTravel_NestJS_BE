import { BaseEntity } from 'src/base.entity';
import { User } from 'src/modules/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('refresh_tokens')
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  refreshTokenId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: false, unique: true })
  token: string;

  @Column({ nullable: false, type: 'timestamp' })
  expireDate: Date;

  @Column({ default: true })
  isValid: boolean;
}
