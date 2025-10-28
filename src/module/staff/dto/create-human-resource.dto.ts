import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID, IsBoolean, IsDateString, IsEmail, IsInt, Min, Max, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { HumanResourceTranslationDto } from '../../../shared/dto/translation.dto';

export class CreateHumanResourceDto {
  @ApiProperty({
    description: 'First name of the human resource',
    example: 'John',
  })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  first_name: string;

  @ApiProperty({
    description: 'Last name of the human resource',
    example: 'Doe',
  })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  last_name: string;

  @ApiProperty({
    description: 'Position of the human resource',
    example: 'Senior Lawyer',
  })
  @IsString({ message: 'Position must be a string' })
  @IsNotEmpty({ message: 'Position is required' })
  position: string;

  @ApiProperty({
    description: 'Email address of the human resource',
    example: 'john.doe@lawcompany.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Phone number of the human resource',
    example: '+1234567890',
    required: false,
  })
  @IsString({ message: 'Phone number must be a string' })
  @IsOptional()
  phone_number?: string;

  @ApiProperty({
    description: 'About information of the human resource',
    example: 'Experienced lawyer with 10+ years in corporate law',
    required: false,
  })
  @IsString({ message: 'About must be a string' })
  @IsOptional()
  about?: string;

  @ApiProperty({
    description: 'Location of the human resource',
    example: 'New York, NY',
    required: false,
  })
  @IsString({ message: 'Location must be a string' })
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: 'Avatar URL of the human resource',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsString({ message: 'Avatar URL must be a string' })
  @IsOptional()
  avatar_url?: string;

  @ApiProperty({
    description: 'Department of the human resource',
    example: 'Corporate Law',
    required: false,
  })
  @IsString({ message: 'Department must be a string' })
  @IsOptional()
  department?: string;

  @ApiProperty({
    description: 'Date of birth of the human resource',
    example: '1990-01-01',
    required: false,
  })
  @IsDateString({}, { message: 'Date of birth must be a valid date' })
  @IsOptional()
  date_of_birth?: string;

  @ApiProperty({
    description: 'Gender of the human resource',
    example: 'Male',
    required: false,
  })
  @IsString({ message: 'Gender must be a string' })
  @IsOptional()
  gender?: string;

  @ApiProperty({
    description: 'Address of the human resource',
    example: '123 Main St, New York, NY 10001',
    required: false,
  })
  @IsString({ message: 'Address must be a string' })
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'Sort order for display',
    example: 1,
    required: false,
  })
  @IsInt({ message: 'Sort order must be a number' })
  @Min(0, { message: 'Sort order must be 0 or greater' })
  @IsOptional()
  sort_order?: number;

  @ApiProperty({
    description: 'Whether the human resource is active',
    example: true,
    required: false,
  })
  @IsBoolean({ message: 'Is active must be a boolean' })
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    description: 'Whether the human resource is featured',
    example: false,
    required: false,
  })
  @IsBoolean({ message: 'Is featured must be a boolean' })
  @IsOptional()
  is_featured?: boolean;

  @ApiProperty({
    description: 'Company name',
    example: 'ABC Law Firm',
    required: false,
  })
  @IsString({ message: 'Company name must be a string' })
  @IsOptional()
  company_name?: string;

  @ApiProperty({
    description: 'Translations for different languages',
    type: [HumanResourceTranslationDto],
    example: [
      {
        language_id: 'uuid-string',
        language_code: 'vi',
        first_name: 'Nguyễn',
        last_name: 'Văn A',
        full_name: 'Nguyễn Văn A',
        position: 'Luật sư cao cấp',
        about: 'Luật sư có kinh nghiệm 10+ năm trong luật doanh nghiệp',
        location: 'Hồ Chí Minh',
        department: 'Luật Doanh nghiệp',
        address: '123 Đường ABC, Quận 1, TP.HCM'
      }
    ],
    required: false,
  })
  @IsArray({ message: 'Translations must be an array' })
  @ValidateNested({ each: true })
  @Type(() => HumanResourceTranslationDto)
  @IsOptional()
  translations?: HumanResourceTranslationDto[];
}
