import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContactResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  full_name: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiPropertyOptional()
  @Expose()
  phone_number?: string;

  @ApiPropertyOptional()
  @Expose()
  subject?: string;

  @ApiProperty()
  @Expose()
  message: string;

  @ApiPropertyOptional()
  @Expose()
  company?: string;

  @ApiPropertyOptional()
  @Expose()
  ip_address?: string;

  @ApiPropertyOptional()
  @Expose()
  user_agent?: string;

  @ApiPropertyOptional()
  @Expose()
  responded_at?: Date;

  @ApiProperty()
  @Expose()
  created_at: Date;

  @ApiProperty()
  @Expose()
  updated_at: Date;
}

