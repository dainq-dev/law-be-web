import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID, IsDateString } from 'class-validator';

export class CreateEducationDto {
  // Degree - all languages required
  @IsString({ message: 'Degree (VI) must be a string' })
  @IsNotEmpty({ message: 'Degree (VI) is required' })
  degree_vi: string;

  @IsString({ message: 'Degree (EN) must be a string' })
  @IsNotEmpty({ message: 'Degree (EN) is required' })
  degree_en: string;

  @IsString({ message: 'Degree (ZH) must be a string' })
  @IsNotEmpty({ message: 'Degree (ZH) is required' })
  degree_zh: string;

  // University - all languages required
  @IsString({ message: 'University (VI) must be a string' })
  @IsNotEmpty({ message: 'University (VI) is required' })
  university_vi: string;

  @IsString({ message: 'University (EN) must be a string' })
  @IsNotEmpty({ message: 'University (EN) is required' })
  university_en: string;

  @IsString({ message: 'University (ZH) must be a string' })
  @IsNotEmpty({ message: 'University (ZH) is required' })
  university_zh: string;

  // Field of study - all languages required
  @IsString({ message: 'Field of study (VI) must be a string' })
  @IsNotEmpty({ message: 'Field of study (VI) is required' })
  field_of_study_vi: string;

  @IsString({ message: 'Field of study (EN) must be a string' })
  @IsNotEmpty({ message: 'Field of study (EN) is required' })
  field_of_study_en: string;

  @IsString({ message: 'Field of study (ZH) must be a string' })
  @IsNotEmpty({ message: 'Field of study (ZH) is required' })
  field_of_study_zh: string;

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

  @IsDateString({}, { message: 'Start date must be a valid date' })
  @IsOptional()
  start_date?: string;

  @IsDateString({}, { message: 'End date must be a valid date' })
  @IsOptional()
  end_date?: string;

  @IsUUID('4', { message: 'Human resource ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Human resource ID is required' })
  human_resource_id: string;
}
