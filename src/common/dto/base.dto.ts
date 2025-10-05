import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BaseDto {
  @ApiPropertyOptional({ description: 'Entity ID' })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({ description: 'Created at timestamp' })
  @IsOptional()
  @IsString()
  createdAt?: string;

  @ApiPropertyOptional({ description: 'Updated at timestamp' })
  @IsOptional()
  @IsString()
  updatedAt?: string;
}
