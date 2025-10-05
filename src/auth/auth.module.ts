import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../common/entities/user.entity';
import { Session } from '../common/entities/session.entity';
import { Otp } from '../common/entities/otp.entity';
import { EmailToken } from '../common/entities/email-token.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailService } from '../shared/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Session, Otp, EmailToken]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('app.jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('app.jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
  exports: [AuthService],
})
export class AuthModule {}
