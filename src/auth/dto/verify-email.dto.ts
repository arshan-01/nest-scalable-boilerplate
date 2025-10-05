import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, IsNumeric } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({ description: 'User email address', example: 'john@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({ description: '6-digit OTP code', example: '123456' })
  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  @IsNumeric({}, { message: 'OTP must contain only numbers' })
  otp: string;
}
