import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../common/entities/user.entity';
import { Session } from '../common/entities/session.entity';
import { Otp } from '../common/entities/otp.entity';
import { EmailToken } from '../common/entities/email-token.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'nestjs_template',
  // Support for cloud databases
  url: process.env.NEON_DATABASE_URL || process.env.SUPABASE_DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Session, Otp, EmailToken],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  subscribers: [__dirname + '/subscribers/*{.ts,.js}'],
});
