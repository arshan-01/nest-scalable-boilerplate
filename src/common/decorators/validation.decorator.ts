import { IsOptional, IsString, IsEmail, IsEnum, IsUUID, IsNumber, IsBoolean, IsDateString, IsArray, Min, Max, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Common validation decorators
export const IsOptionalString = () => IsOptional(IsString());
export const IsOptionalEmail = () => IsOptional(IsEmail());
export const IsOptionalUUID = () => IsOptional(IsUUID());
export const IsOptionalNumber = () => IsOptional(IsNumber());
export const IsOptionalBoolean = () => IsOptional(IsBoolean());
export const IsOptionalDate = () => IsOptional(IsDateString());
export const IsOptionalArray = () => IsOptional(IsArray());

// Pagination decorators
export const IsPage = () => IsOptional(IsNumber({}, { each: false }), Min(1));
export const IsLimit = () => IsOptional(IsNumber({}, { each: false }), Min(1), Max(100));

// String length decorators
export const IsShortString = (min: number = 1, max: number = 50) => 
  IsString(MinLength(min), MaxLength(max));
export const IsMediumString = (min: number = 1, max: number = 100) => 
  IsString(MinLength(min), MaxLength(max));
export const IsLongString = (min: number = 1, max: number = 500) => 
  IsString(MinLength(min), MaxLength(max));

// Password validation
export const IsPassword = () => IsString(
  MinLength(8),
  Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number',
  })
);

// OTP validation
export const IsOTP = () => IsString(
  MinLength(6),
  MaxLength(6),
  Matches(/^\d{6}$/, { message: 'OTP must be exactly 6 digits' })
);

// API Property decorators
export const ApiStringProperty = (description: string, required: boolean = true, example?: string) =>
  required 
    ? ApiProperty({ description, example })
    : ApiPropertyOptional({ description, example });

export const ApiEmailProperty = (description: string = 'Email address', required: boolean = true, example: string = 'user@example.com') =>
  required 
    ? ApiProperty({ description, example, format: 'email' })
    : ApiPropertyOptional({ description, example, format: 'email' });

export const ApiPasswordProperty = (description: string = 'Password', required: boolean = true) =>
  required 
    ? ApiProperty({ description, minLength: 8, example: 'SecurePass123' })
    : ApiPropertyOptional({ description, minLength: 8, example: 'SecurePass123' });

export const ApiOTPProperty = (description: string = 'OTP code', required: boolean = true) =>
  required 
    ? ApiProperty({ description, example: '123456', minLength: 6, maxLength: 6 })
    : ApiPropertyOptional({ description, example: '123456', minLength: 6, maxLength: 6 });

export const ApiUUIDProperty = (description: string, required: boolean = true) =>
  required 
    ? ApiProperty({ description, format: 'uuid' })
    : ApiPropertyOptional({ description, format: 'uuid' });

export const ApiPageProperty = (description: string = 'Page number', required: boolean = false) =>
  ApiPropertyOptional({ description, example: 1, minimum: 1, type: Number });

export const ApiLimitProperty = (description: string = 'Items per page', required: boolean = false) =>
  ApiPropertyOptional({ description, example: 10, minimum: 1, maximum: 100, type: Number });
