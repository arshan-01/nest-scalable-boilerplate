import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, MaxLength, IsMobilePhone } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ description: 'User full name', example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name?: string;

  @ApiProperty({ description: 'User bio', example: 'Software developer', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Bio cannot exceed 500 characters' })
  bio?: string;

  @ApiProperty({ description: 'User phone number', example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  @IsMobilePhone(null, {}, { message: 'Please provide a valid phone number' })
  phone?: string;
}
