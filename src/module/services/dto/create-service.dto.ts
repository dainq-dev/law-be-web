import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID, IsBoolean, IsInt, Min, Max, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceTranslationDto } from '../../../shared/dto/translation.dto';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Name of the service',
    example: 'Corporate Law Consultation',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    description: 'Description of the service',
    example: 'Comprehensive legal consultation for corporate matters',
  })
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @ApiProperty({
    description: 'Short description of the service',
    example: 'Expert corporate legal advice',
    required: false,
  })
  @IsString({ message: 'Short description must be a string' })
  @IsOptional()
  short_description?: string;

  @ApiProperty({
    description: 'Icon URL for the service',
    example: 'https://example.com/icon.svg',
    required: false,
  })
  @IsString({ message: 'Icon URL must be a string' })
  @IsOptional()
  icon_url?: string;

  @ApiProperty({
    description: 'Image URL for the service',
    example: 'https://example.com/service-image.jpg',
    required: false,
  })
  @IsString({ message: 'Image URL must be a string' })
  @IsOptional()
  image_url?: string;

  @ApiProperty({
    description: 'Legal fields covered by this service',
    example: ['Bào chữa bị can, bị cáo', 'Bảo vệ nạn nhân', 'Tư vấn pháp lý'],
    required: false,
  })
  @IsArray({ message: 'Legal fields must be an array' })
  @IsString({ each: true, message: 'Each legal field must be a string' })
  @IsOptional()
  legal_fields?: string[];

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
    description: 'Whether the service is active',
    example: true,
    required: false,
  })
  @IsBoolean({ message: 'Is active must be a boolean' })
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    description: 'Whether the service is featured',
    example: false,
    required: false,
  })
  @IsBoolean({ message: 'Is featured must be a boolean' })
  @IsOptional()
  is_featured?: boolean;

  @ApiProperty({
    description: 'Tags for the service',
    example: ['corporate', 'legal', 'consultation'],
    required: false,
  })
  @IsArray({ message: 'Tags must be an array' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  @IsOptional()
  tags?: string[];


  @ApiProperty({
    description: 'Translations for different languages',
    type: [ServiceTranslationDto],
    example: [
      {
        language_id: 'uuid-string',
        language_code: 'vi',
        name: 'Tư vấn Luật Doanh nghiệp',
        short_description: 'Tư vấn pháp lý chuyên nghiệp cho doanh nghiệp',
        description: 'Dịch vụ tư vấn pháp lý toàn diện cho các vấn đề doanh nghiệp',
        category: 'Luật Doanh nghiệp',
        processing_time: '2-3 ngày làm việc',
        features: 'Tư vấn chuyên gia, Rà soát tài liệu pháp lý',
        requirements: 'Giấy phép kinh doanh hợp lệ, Tài liệu công ty'
      }
    ],
    required: false,
  })
  @IsArray({ message: 'Translations must be an array' })
  @ValidateNested({ each: true })
  @Type(() => ServiceTranslationDto)
  @IsOptional()
  translations?: ServiceTranslationDto[];
}
