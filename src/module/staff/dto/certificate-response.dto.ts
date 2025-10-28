import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CertificateResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiPropertyOptional()
  @Expose()
  issuing_organization?: string;

  @ApiPropertyOptional()
  @Expose()
  issue_date?: Date;

  @ApiPropertyOptional()
  @Expose()
  expiration_date?: Date;

  @ApiPropertyOptional()
  @Expose()
  credential_id?: string;

  @ApiPropertyOptional()
  @Expose()
  credential_url?: string;

  @ApiPropertyOptional()
  @Expose()
  description?: string;

  @ApiProperty()
  @Expose()
  human_resource_id: string;

  @ApiProperty()
  @Expose()
  created_at: Date;

  @ApiProperty()
  @Expose()
  updated_at: Date;
}

