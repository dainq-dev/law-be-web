import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID, IsDateString } from 'class-validator';

export class CreateEducationDto {
  @ApiProperty({
    description: 'Degree or qualification name',
    example: 'Bachelor of Laws',
  })
  @IsString({ message: 'Degree must be a string' })
  @IsNotEmpty({ message: 'Degree is required' })
  degree: string;

  @ApiProperty({
    description: 'Institution name',
    example: 'Harvard Law School',
  })
  @IsString({ message: 'Institution must be a string' })
  @IsNotEmpty({ message: 'Institution is required' })
  institution: string;

  @ApiProperty({
    description: 'Field of study',
    example: 'Law',
    required: false,
  })
  @IsString({ message: 'Field of study must be a string' })
  @IsOptional()
  field_of_study?: string;

  @ApiProperty({
    description: 'Start date of education',
    example: '2010-09-01',
    required: false,
  })
  @IsDateString({}, { message: 'Start date must be a valid date' })
  @IsOptional()
  start_date?: string;

  @ApiProperty({
    description: 'End date of education',
    example: '2014-06-01',
    required: false,
  })
  @IsDateString({}, { message: 'End date must be a valid date' })
  @IsOptional()
  end_date?: string;

  @ApiProperty({
    description: 'Grade or GPA',
    example: '3.8/4.0',
    required: false,
  })
  @IsString({ message: 'Grade must be a string' })
  @IsOptional()
  grade?: string;

  @ApiProperty({
    description: 'Description of the education',
    example: 'Specialized in corporate law and international business',
    required: false,
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Human resource ID',
    example: 'uuid-string',
  })
  @IsUUID('4', { message: 'Human resource ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Human resource ID is required' })
  human_resource_id: string;
}
