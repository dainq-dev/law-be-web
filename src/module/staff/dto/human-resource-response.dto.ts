import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class HumanResourceResponseDto {
  @Expose()
  id: string;

  @Expose()
  full_name_vi: string;

  @Expose()
  full_name_en?: string;

  @Expose()
  full_name_zh?: string;

  @Expose()
  position_vi: string;

  @Expose()
  position_en?: string;

  @Expose()
  position_zh?: string;

  @Expose()
  email: string;

  @Expose()
  phone_number: string;

  @Expose()
  about_vi?: string;

  @Expose()
  about_en?: string;

  @Expose()
  about_zh?: string;

  @Expose()
  location_vi?: string;

  @Expose()
  location_en?: string;

  @Expose()
  location_zh?: string;

  @Expose()
  avatar_url: string;

  @Expose()
  date_of_birth: Date;

  @Expose()
  gender: string;

  @Expose()
  address_vi?: string;

  @Expose()
  address_en?: string;

  @Expose()
  address_zh?: string;

  @Expose()
  is_active: boolean;

  @Expose()
  is_featured: boolean;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
