import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Session } from './session.entity';
import { Otp } from './otp.entity';
import { EmailToken } from './email-token.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  SUPER_ADMIN = 'super_admin',
}

export enum LoginMethod {
  EMAIL = 'email',
  GOOGLE = 'google',
  BOTH = 'both',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column({ nullable: true })
  @Exclude()
  password?: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ nullable: true, length: 500 })
  bio?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLogin?: Date;

  @Column({ nullable: true })
  lastVerificationEmailSent?: Date;

  @Column({ nullable: true })
  lastPasswordResetEmailSent?: Date;

  @Column({ nullable: true, unique: true })
  @Index()
  googleId?: string;

  @Column({
    type: 'enum',
    enum: LoginMethod,
    default: LoginMethod.EMAIL,
  })
  loginMethod: LoginMethod;

  @Column({ default: false })
  twoFactorEnabled: boolean;

  @Column({ nullable: true })
  @Exclude()
  twoFactorSecret?: string;

  @Column({ default: false })
  otpEnabled: boolean;

  @Column({ type: 'jsonb', default: {} })
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    language: string;
    timezone: string;
  };

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => Otp, (otp) => otp.user)
  otps: Otp[];

  @OneToMany(() => EmailToken, (emailToken) => emailToken.user)
  emailTokens: EmailToken[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
