import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsDateString, IsEmail } from 'class-validator';

export class CreateHumanResourceDto {
  @IsString({ message: 'Full name (VI) must be a string' })
  @IsNotEmpty({ message: 'Full name (VI) is required' })
  full_name_vi: string;

  @IsString({ message: 'Full name (EN) must be a string' })
  @IsNotEmpty({ message: 'Full name (EN) is required' })
  full_name_en: string;

  @IsString({ message: 'Full name (ZH) must be a string' })
  @IsNotEmpty({ message: 'Full name (ZH) is required' })
  full_name_zh: string;

  @IsString({ message: 'Position (VI) must be a string' })
  @IsNotEmpty({ message: 'Position (VI) is required' })
  position_vi: string;

  @IsString({ message: 'Position (EN) must be a string' })
  @IsNotEmpty({ message: 'Position (EN) is required' })
  position_en: string;

  @IsString({ message: 'Position (ZH) must be a string' })
  @IsNotEmpty({ message: 'Position (ZH) is required' })
  position_zh: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Phone number must be a string' })
  @IsOptional()
  phone_number?: string;

  @IsString({ message: 'About (VI) must be a string' })
  @IsOptional()
  about_vi?: string;

  @IsString({ message: 'About (EN) must be a string' })
  @IsOptional()
  about_en?: string;

  @IsString({ message: 'About (ZH) must be a string' })
  @IsOptional()
  about_zh?: string;

  @IsString({ message: 'Location (VI) must be a string' })
  @IsOptional()
  location_vi?: string;

  @IsString({ message: 'Location (EN) must be a string' })
  @IsOptional()
  location_en?: string;

  @IsString({ message: 'Location (ZH) must be a string' })
  @IsOptional()
  location_zh?: string;

  @IsString({ message: 'Avatar URL must be a string' })
  @IsOptional()
  avatar_url?: string;
  
  @IsDateString({}, { message: 'Date of birth must be a valid date' })
  @IsOptional()
  date_of_birth?: string;

  @IsString({ message: 'Gender must be a string' })
  @IsOptional()
  gender?: string;
  
  @IsString({ message: 'Address (VI) must be a string' })
  @IsOptional()
  address_vi?: string;

  @IsString({ message: 'Address (EN) must be a string' })
  @IsOptional()
  address_en?: string;

  @IsString({ message: 'Address (ZH) must be a string' })
  @IsOptional()
  address_zh?: string;

  @IsBoolean({ message: 'Is active must be a boolean' })
  @IsOptional()
  is_active?: boolean;

  @IsBoolean({ message: 'Is featured must be a boolean' })
  @IsOptional()
  is_featured?: boolean;
}
