import { Expose } from 'class-transformer';

export class ServiceResponseDto {
  @Expose()
  id: string;

  @Expose()
  name_vi: string;

  @Expose()
  name_en?: string;

  @Expose()
  name_zh?: string;

  @Expose()
  short_description_vi?: string;

  @Expose()
  short_description_en?: string;

  @Expose()
  short_description_zh?: string;

  @Expose()
  description_vi?: string;

  @Expose()
  description_en?: string;

  @Expose()
  description_zh?: string;

  @Expose()
  legal_fields_vi?: string;

  @Expose()
  legal_fields_en?: string;

  @Expose()
  legal_fields_zh?: string;

  @Expose()
  image_url: string;

  @Expose()
  is_active: boolean;

  @Expose()
  is_featured: boolean;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
