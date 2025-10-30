import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CertificateResponseDto {
  @Expose()
  id: string;

  @Expose()
  name_vi: string;

  @Expose()
  name_en: string;

  @Expose()
  name_zh: string;

  @Expose()
  issuing_organization_vi: string;

  @Expose()
  issuing_organization_en: string;

  @Expose()
  issuing_organization_zh: string;

  @Expose()
  issue_date?: Date;

  @Expose()
  expiration_date?: Date;

  @Expose()
  credential_id?: string;

  @Expose()
  credential_url?: string;

  @Expose()
  description_vi: string;

  @Expose()
  description_en: string;

  @Expose()
  description_zh: string;

  @Expose()
  human_resource_id: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}

