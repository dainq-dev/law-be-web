import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class LanguageQueryDto {
  @ApiProperty({
    description: 'Language code for the response (vi, en, zh)',
    example: 'vi',
    required: false,
  })
  @IsString({ message: 'Language code must be a string' })
  @IsOptional()
  language_code?: string;

  @ApiProperty({
    description: 'Language (alias of language_code) for backward compatibility',
    example: 'vi',
    required: false,
  })
  @IsString({ message: 'Language must be a string' })
  @IsOptional()
  language?: string;
}

export class PaginationQueryDto extends LanguageQueryDto {
  @ApiProperty({
    description: 'Page number',
    example: 1,
    required: false,
    minimum: 1,
  })
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return 1;
    const parsed = parseInt(value);
    return isNaN(parsed) ? 1 : parsed;
  })
  @IsInt({ message: 'Page must be a number' })
  @Min(1, { message: 'Page must be 1 or greater' })
  @IsOptional()
  page: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    required: false,
    minimum: 1,
    maximum: 100,
  })
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return 10;
    const parsed = parseInt(value);
    return isNaN(parsed) ? 10 : parsed;
  })
  @IsInt({ message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be 1 or greater' })
  @Max(100, { message: 'Limit must be 100 or less' })
  @IsOptional()
  limit: number = 10;

  @ApiProperty({
    description: 'Search term',
    example: 'lawyer',
    required: false,
  })
  @IsString({ message: 'Search must be a string' })
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'Sort field',
    example: 'created_at',
    required: false,
  })
  @IsString({ message: 'Sort field must be a string' })
  @IsOptional()
  sort_by?: string;

  @ApiProperty({
    description: 'Sort order',
    example: 'DESC',
    required: false,
    enum: ['ASC', 'DESC'],
  })
  @IsString({ message: 'Sort order must be a string' })
  @IsOptional()
  sort_order?: 'ASC' | 'DESC' = 'DESC';
}
