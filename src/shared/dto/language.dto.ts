import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsInt, Min, Max } from 'class-validator';

export class CreateLanguageDto {
  @ApiProperty({
    description: 'Language code (ISO 639-1)',
    example: 'vi',
  })
  @IsString({ message: 'Code must be a string' })
  @IsNotEmpty({ message: 'Code is required' })
  code: string;

  @ApiProperty({
    description: 'Language name in English',
    example: 'Vietnamese',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    description: 'Language name in native language',
    example: 'Tiếng Việt',
  })
  @IsString({ message: 'Native name must be a string' })
  @IsNotEmpty({ message: 'Native name is required' })
  native_name: string;

  @ApiProperty({
    description: 'Flag emoji for the language',
    example: '🇻🇳',
  })
  @IsString({ message: 'Flag must be a string' })
  @IsNotEmpty({ message: 'Flag is required' })
  flag: string;

  @ApiProperty({
    description: 'Whether the language is active',
    example: true,
    required: false,
  })
  @IsBoolean({ message: 'Is active must be a boolean' })
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    description: 'Whether this is the default language',
    example: false,
    required: false,
  })
  @IsBoolean({ message: 'Is default must be a boolean' })
  @IsOptional()
  is_default?: boolean;

  @ApiProperty({
    description: 'Sort order for display',
    example: 1,
    required: false,
  })
  @IsInt({ message: 'Sort order must be a number' })
  @Min(0, { message: 'Sort order must be 0 or greater' })
  @IsOptional()
  sort_order?: number;
}

export class UpdateLanguageDto {
  @ApiProperty({
    description: 'Language name in English',
    example: 'Vietnamese',
    required: false,
  })
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Language name in native language',
    example: 'Tiếng Việt',
    required: false,
  })
  @IsString({ message: 'Native name must be a string' })
  @IsOptional()
  native_name?: string;

  @ApiProperty({
    description: 'Flag emoji for the language',
    example: '🇻🇳',
    required: false,
  })
  @IsString({ message: 'Flag must be a string' })
  @IsOptional()
  flag?: string;

  @ApiProperty({
    description: 'Whether the language is active',
    example: true,
    required: false,
  })
  @IsBoolean({ message: 'Is active must be a boolean' })
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    description: 'Whether this is the default language',
    example: false,
    required: false,
  })
  @IsBoolean({ message: 'Is default must be a boolean' })
  @IsOptional()
  is_default?: boolean;

  @ApiProperty({
    description: 'Sort order for display',
    example: 1,
    required: false,
  })
  @IsInt({ message: 'Sort order must be a number' })
  @Min(0, { message: 'Sort order must be 0 or greater' })
  @IsOptional()
  sort_order?: number;
}

export class LanguageResponseDto {
  @ApiProperty({
    description: 'Language ID',
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'Language code (ISO 639-1)',
    example: 'vi',
  })
  code: string;

  @ApiProperty({
    description: 'Language name in English',
    example: 'Vietnamese',
  })
  name: string;

  @ApiProperty({
    description: 'Language name in native language',
    example: 'Tiếng Việt',
  })
  native_name: string;

  @ApiProperty({
    description: 'Flag emoji for the language',
    example: '🇻🇳',
  })
  flag: string;

  @ApiProperty({
    description: 'Whether the language is active',
    example: true,
  })
  is_active: boolean;

  @ApiProperty({
    description: 'Whether this is the default language',
    example: true,
  })
  is_default: boolean;

  @ApiProperty({
    description: 'Sort order for display',
    example: 1,
  })
  sort_order: number;

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updated_at: Date;
}
