import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateTranslationDto {
  @ApiProperty({
    description: 'Language ID for the translation',
    example: 'uuid-string',
  })
  @IsString({ message: 'Language code must be a string' })
  @IsNotEmpty({ message: 'Language code is required' })
  language_code: string;

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
    description: 'Features in the specific language',
    example: 'Expert consultation, Legal document review',
    required: false,
  })
  @IsString({ message: 'Features must be a string' })
  @IsOptional()
  fields?: string;
}
