import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class TranslationDto {
  @ApiProperty({
    description: 'Language ID for the translation',
    example: 'uuid-string',
  })
  @IsUUID('4', { message: 'Language ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Language ID is required' })
  language_id: string;

  @ApiProperty({
    description: 'Language code for the translation',
    example: 'vi',
  })
  @IsString({ message: 'Language code must be a string' })
  @IsNotEmpty({ message: 'Language code is required' })
  language_code: string;
}

export class HumanResourceTranslationDto extends TranslationDto {
  @ApiProperty({
    description: 'First name in the specific language',
    example: 'John',
  })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  first_name: string;

  @ApiProperty({
    description: 'Last name in the specific language',
    example: 'Doe',
  })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  last_name: string;

  @ApiProperty({
    description: 'Full name in the specific language',
    example: 'John Doe',
  })
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  full_name: string;

  @ApiProperty({
    description: 'Position in the specific language',
    example: 'Senior Lawyer',
  })
  @IsString({ message: 'Position must be a string' })
  @IsNotEmpty({ message: 'Position is required' })
  position: string;

  @ApiProperty({
    description: 'About information in the specific language',
    example: 'Experienced lawyer with 10+ years in corporate law',
    required: false,
  })
  @IsString({ message: 'About must be a string' })
  @IsOptional()
  about?: string;

  @ApiProperty({
    description: 'Location in the specific language',
    example: 'New York, NY',
    required: false,
  })
  @IsString({ message: 'Location must be a string' })
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: 'Department in the specific language',
    example: 'Corporate Law',
    required: false,
  })
  @IsString({ message: 'Department must be a string' })
  @IsOptional()
  department?: string;

  @ApiProperty({
    description: 'Address in the specific language',
    example: '123 Main St, New York, NY 10001',
    required: false,
  })
  @IsString({ message: 'Address must be a string' })
  @IsOptional()
  address?: string;
}

export class ServiceTranslationDto extends TranslationDto {
  @ApiProperty({
    description: 'Name in the specific language',
    example: 'Corporate Law Consultation',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    description: 'Short description in the specific language',
    example: 'Expert corporate legal advice',
    required: false,
  })
  @IsString({ message: 'Short description must be a string' })
  @IsOptional()
  short_description?: string;

  @ApiProperty({
    description: 'Description in the specific language',
    example: 'Comprehensive legal consultation for corporate matters',
    required: false,
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Category in the specific language',
    example: 'Corporate Law',
    required: false,
  })
  @IsString({ message: 'Category must be a string' })
  @IsOptional()
  category?: string;

  @ApiProperty({
    description: 'Processing time in the specific language',
    example: '2-3 business days',
    required: false,
  })
  @IsString({ message: 'Processing time must be a string' })
  @IsOptional()
  processing_time?: string;

  @ApiProperty({
    description: 'Features in the specific language',
    example: 'Expert consultation, Legal document review',
    required: false,
  })
  @IsString({ message: 'Features must be a string' })
  @IsOptional()
  features?: string;

  @ApiProperty({
    description: 'Requirements in the specific language',
    example: 'Valid business license, Company documents',
    required: false,
  })
  @IsString({ message: 'Requirements must be a string' })
  @IsOptional()
  requirements?: string;
}

export class BlogTranslationDto extends TranslationDto {
  @ApiProperty({
    description: 'Title in the specific language',
    example: 'Understanding Corporate Law',
  })
  @IsString({ message: 'Title must be a string' })
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Slug in the specific language',
    example: 'understanding-corporate-law',
    required: false,
  })
  @IsString({ message: 'Slug must be a string' })
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: 'Excerpt in the specific language',
    example: 'A comprehensive guide to corporate law...',
    required: false,
  })
  @IsString({ message: 'Excerpt must be a string' })
  @IsOptional()
  excerpt?: string;
}

export class CategoryTranslationDto extends TranslationDto {
  @ApiProperty({
    description: 'Name in the specific language',
    example: 'Corporate Law',
  })
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  name?: string;
}

export class CompanyTranslationDto extends TranslationDto {
  @ApiProperty({
    description: 'Company name in the specific language',
    example: 'Law & Associates',
  })
  @IsString({ message: 'Company name must be a string' })
  @IsNotEmpty({ message: 'Company name is required' })
  company_name: string;
}
