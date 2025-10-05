import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Current password', example: 'CurrentPass123' })
  @IsString()
  @MinLength(1, { message: 'Current password is required' })
  currentPassword: string;

  @ApiProperty({ 
    description: 'New password', 
    example: 'NewSecurePass123',
    minLength: 8
  })
  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'New password must contain at least one lowercase letter, one uppercase letter, and one number',
  })
  newPassword: string;
}
