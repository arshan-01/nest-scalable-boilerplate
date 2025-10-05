import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({ description: 'User email address', example: 'john@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}
