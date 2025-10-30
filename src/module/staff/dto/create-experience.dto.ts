import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID, IsDateString, IsBoolean } from 'class-validator';

export class CreateExperienceDto {
  // Position/Title - all languages required
  @IsString({ message: 'Position (VI) must be a string' })
  @IsNotEmpty({ message: 'Position (VI) is required' })
  position_vi: string;

  @IsString({ message: 'Position (EN) must be a string' })
  @IsNotEmpty({ message: 'Position (EN) is required' })
  position_en: string;

  @IsString({ message: 'Position (ZH) must be a string' })
  @IsNotEmpty({ message: 'Position (ZH) is required' })
  position_zh: string;

  // Company - all languages required
  @IsString({ message: 'Company (VI) must be a string' })
  @IsNotEmpty({ message: 'Company (VI) is required' })
  company_vi: string;

  @IsString({ message: 'Company (EN) must be a string' })
  @IsNotEmpty({ message: 'Company (EN) is required' })
  company_en: string;

  @IsString({ message: 'Company (ZH) must be a string' })
  @IsNotEmpty({ message: 'Company (ZH) is required' })
  company_zh: string;

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
