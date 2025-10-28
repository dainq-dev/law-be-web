import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID, IsDateString, IsBoolean } from 'class-validator';

export class CreateExperienceDto {
  @ApiProperty({
    description: 'Job title or position',
    example: 'Senior Associate',
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiProperty({
    description: 'Company or organization name',
    example: 'Smith & Associates Law Firm',
  })
  @IsString({ message: 'Company must be a string' })
  @IsNotEmpty({ message: 'Company is required' })
  company: string;

  @ApiProperty({
    description: 'Location of the job',
    example: 'New York, NY',
    required: false,
  })
  @IsString({ message: 'Location must be a string' })
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: 'Start date of the experience',
    example: '2018-01-01',
    required: false,
  })
  @IsDateString({}, { message: 'Start date must be a valid date' })
  @IsOptional()
  start_date?: string;

  @ApiProperty({
    description: 'End date of the experience',
    example: '2022-12-31',
    required: false,
  })
  @IsDateString({}, { message: 'End date must be a valid date' })
  @IsOptional()
  end_date?: string;

  @ApiProperty({
    description: 'Whether this is current position',
    example: false,
    required: false,
  })
  @IsBoolean({ message: 'Is current must be a boolean' })
  @IsOptional()
  is_current?: boolean;

  @ApiProperty({
    description: 'Description of the experience',
    example: 'Handled complex corporate mergers and acquisitions',
    required: false,
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Key achievements or responsibilities',
    example: 'Led team of 5 lawyers, managed $50M+ deals',
    required: false,
  })
  @IsString({ message: 'Achievements must be a string' })
  @IsOptional()
  achievements?: string;

  @ApiProperty({
    description: 'Human resource ID',
    example: 'uuid-string',
  })
  @IsUUID('4', { message: 'Human resource ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Human resource ID is required' })
  human_resource_id: string;
}
