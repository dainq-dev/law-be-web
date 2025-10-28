import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID, IsInt, Min } from 'class-validator';

export class CreateProcessStepDto {
  @ApiProperty({
    description: 'Title of the process step',
    example: 'Initial Consultation',
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiProperty({
    description: 'Description of the process step',
    example: 'We will discuss your legal needs and provide initial advice',
  })
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @ApiProperty({
    description: 'Step order in the process',
    example: 1,
  })
  @IsInt({ message: 'Step order must be a number' })
  @Min(1, { message: 'Step order must be 1 or greater' })
  @IsNotEmpty({ message: 'Step order is required' })
  step_order: number;

  @ApiProperty({
    description: 'Icon URL for the step',
    example: 'https://example.com/step-icon.svg',
    required: false,
  })
  @IsString({ message: 'Icon URL must be a string' })
  @IsOptional()
  icon_url?: string;

  @ApiProperty({
    description: 'Estimated duration in hours',
    example: 1,
    required: false,
  })
  @IsInt({ message: 'Duration must be a number' })
  @Min(0, { message: 'Duration must be 0 or greater' })
  @IsOptional()
  duration_hours?: number;

  @ApiProperty({
    description: 'Service ID',
    example: 'uuid-string',
  })
  @IsUUID('4', { message: 'Service ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Service ID is required' })
  service_id: string;
}
