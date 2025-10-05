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

export enum EmailTokenType {
  EMAIL_VERIFICATION = 'email_verification',
  PASSWORD_RESET = 'password_reset',
  EMAIL_CHANGE = 'email_change',
}

export enum EmailTokenStatus {
  PENDING = 'pending',
  USED = 'used',
  EXPIRED = 'expired',
}

@Entity('email_tokens')
export class EmailToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @Column()
  @Index()
  email: string;

  @Column({ unique: true })
  @Index()
  token: string;

  @Column({
    type: 'enum',
    enum: EmailTokenType,
  })
  @Index()
  type: EmailTokenType;

  @Column({
    type: 'enum',
    enum: EmailTokenStatus,
    default: EmailTokenStatus.PENDING,
  })
  @Index()
  status: EmailTokenStatus;

  @Column()
  @Index()
  expiresAt: Date;

  @Column({ nullable: true })
  usedAt?: Date;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ nullable: true })
  userAgent?: string;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @ManyToOne(() => User, (user) => user.emailTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
