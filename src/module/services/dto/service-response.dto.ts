import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ServiceResponseDto {
  @ApiProperty({ description: 'Service ID', example: 'uuid-string' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Service name', example: 'Corporate Law Consultation' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Service description' })
  @Expose()
  description: string;

  @ApiProperty({ description: 'Short description' })
  @Expose()
  short_description: string;

  @ApiProperty({ description: 'Icon URL' })
  @Expose()
  icon_url: string;

  @ApiProperty({ description: 'Image URL' })
  @Expose()
  image_url: string;

  @ApiProperty({ description: 'Legal fields covered by this service' })
  @Expose()
  legal_fields: string[];

  @ApiProperty({ description: 'Sort order' })
  @Expose()
  sort_order: number;

  @ApiProperty({ description: 'Is active status' })
  @Expose()
  is_active: boolean;

  @ApiProperty({ description: 'Is featured status' })
  @Expose()
  is_featured: boolean;

  @ApiProperty({ description: 'Service tags' })
  @Expose()
  tags: string[];

  @ApiProperty({ description: 'Process steps' })
  @Expose()
  process_steps: {
    id: string;
    title: string;
    description: string;
    step_order: number;
  }[];

  @ApiProperty({ description: 'Created at' })
  @Expose()
  created_at: Date;

  @ApiProperty({ description: 'Updated at' })
  @Expose()
  updated_at: Date;

  @ApiProperty({ description: 'Available translations', required: false })
  @Expose()
  translations?: {
    id: string;
    language_id: string;
    language_code: string;
    name: string;
    short_description: string;
    description: string;
    category: string;
    processing_time: string;
    features: string;
    requirements: string;
  }[];

  @ApiProperty({ description: 'Available language codes', required: false })
  @Expose()
  available_languages?: string[];
}
