import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateStatusDto {
  @ApiProperty({ example: 'published', enum: ['draft', 'published', 'archived'] })
  @IsBoolean()
  is_active: boolean;

  @ApiProperty({ required: false, description: 'Optional ISO date string to set published_at when publishing' })
  @IsOptional()
  @IsString()
  published_at?: string;
}


