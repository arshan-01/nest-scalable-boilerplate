import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../common/entities/user.entity';
import { Session } from '../common/entities/session.entity';
import { Otp } from '../common/entities/otp.entity';
import { EmailToken } from '../common/entities/email-token.entity';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const databaseConfig = configService.get('app.database');
  
  // If using cloud database (Neon or Supabase), use URL
  if (databaseConfig.url) {
    return {
      type: 'postgres',
      url: databaseConfig.url,
      ssl: databaseConfig.ssl,
      synchronize: databaseConfig.synchronize,
      logging: databaseConfig.logging,
      entities: [User, Session, Otp, EmailToken],
      migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
      migrationsRun: false,
      autoLoadEntities: true,
    };
  }
  
  // Local PostgreSQL configuration
  return {
    type: 'postgres',
    host: databaseConfig.host,
    port: databaseConfig.port,
    username: databaseConfig.username,
    password: databaseConfig.password,
    database: databaseConfig.database,
    ssl: databaseConfig.ssl,
    synchronize: databaseConfig.synchronize,
    logging: databaseConfig.logging,
    entities: [User, Session, Otp, EmailToken],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    migrationsRun: false,
    autoLoadEntities: true,
  };
};
