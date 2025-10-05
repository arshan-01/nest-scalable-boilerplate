import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

export enum LoginMethod {
  EMAIL = 'email',
  GOOGLE = 'google',
  OTP = 'otp',
}

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @Column({ unique: true })
  @Index()
  refreshToken: string;

  @Column()
  accessToken: string;

  @Column({ nullable: true })
  userAgent?: string;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ nullable: true })
  deviceInfo?: string;

  @Column({ type: 'jsonb', nullable: true })
  location?: {
    country?: string;
    city?: string;
    region?: string;
  };

  @Column({ default: true })
  isActive: boolean;

  @Column()
  @Index()
  expiresAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  lastActivity: Date;

  @Column({
    type: 'enum',
    enum: LoginMethod,
    default: LoginMethod.EMAIL,
  })
  loginMethod: LoginMethod;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
