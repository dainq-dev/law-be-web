import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateServiceDto {
  // Name - all languages required
  @IsString({ message: 'Name (VI) must be a string' })
  @IsNotEmpty({ message: 'Name (VI) is required' })
  name_vi: string;

  @IsString({ message: 'Name (EN) must be a string' })
  @IsNotEmpty({ message: 'Name (EN) is required' })
  name_en: string;

  @IsString({ message: 'Name (ZH) must be a string' })
  @IsNotEmpty({ message: 'Name (ZH) is required' })
  name_zh: string;

  // Short description - all languages optional
  @IsString({ message: 'Short description (VI) must be a string' })
  @IsOptional()
  short_description_vi?: string;

  @IsString({ message: 'Short description (EN) must be a string' })
  @IsOptional()
  short_description_en?: string;

  @IsString({ message: 'Short description (ZH) must be a string' })
  @IsOptional()
  short_description_zh?: string;

  // Description - all languages optional
  @IsString({ message: 'Description (VI) must be a string' })
  @IsOptional()
  description_vi?: string;

  @IsString({ message: 'Description (EN) must be a string' })
  @IsOptional()
  description_en?: string;

  @IsString({ message: 'Description (ZH) must be a string' })
  @IsOptional()
  description_zh?: string;

  // Legal fields - all languages optional (as string arrays, will be converted to JSON string in service)
  @IsArray({ message: 'Legal fields (VI) must be an array' })
  @IsString({ each: true, message: 'Each legal field (VI) must be a string' })
  @IsOptional()
  legal_fields_vi?: string[];

  @IsArray({ message: 'Legal fields (EN) must be an array' })
  @IsString({ each: true, message: 'Each legal field (EN) must be a string' })
  @IsOptional()
  legal_fields_en?: string[];

  @IsArray({ message: 'Legal fields (ZH) must be an array' })
  @IsString({ each: true, message: 'Each legal field (ZH) must be a string' })
  @IsOptional()
  legal_fields_zh?: string[];

  @IsString({ message: 'Image URL must be a string' })
  @IsOptional()
  image_url?: string;

  @IsBoolean({ message: 'Is active must be a boolean' })
  @IsOptional()
  is_active?: boolean;

  @IsBoolean({ message: 'Is featured must be a boolean' })
  @IsOptional()
  is_featured?: boolean;
}
