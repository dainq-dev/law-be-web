import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Tên danh mục' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Slug của danh mục' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ description: 'Mô tả danh mục' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Thứ tự sắp xếp', default: 0 })
  @IsOptional()
  @IsInt()
  sort_order?: number;
}

