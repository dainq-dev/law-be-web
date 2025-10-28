import { IsString, IsOptional, IsUUID, IsDate, IsArray, IsBoolean, IsNumber, IsUrl, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

export class CreateBlogDto {
  @ApiProperty({ description: 'Tiêu đề bài viết' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Slug của bài viết' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ description: 'Mô tả ngắn' })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiPropertyOptional({ description: 'Trạng thái bài viết', default: 'draft' })
  @IsOptional()
  @IsString()
  status?: string; // draft, published, archived

  @ApiPropertyOptional({ description: 'Lĩnh vực của bài viết' })
  @IsOptional()
  @IsString()
  field?: string;

  @ApiPropertyOptional({ description: 'Ngày xuất bản' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  published_at?: Date;

  // Featured Image fields
  @ApiPropertyOptional({ description: 'URL hình ảnh đại diện' })
  @IsOptional()
  @IsUrl()
  featured_image_url?: string;

  @ApiPropertyOptional({ description: 'Alt text cho hình ảnh đại diện' })
  @IsOptional()
  @IsString()
  featured_image_alt?: string;

  // SEO fields
  @ApiPropertyOptional({ description: 'Meta title cho SEO' })
  @IsOptional()
  @IsString()
  meta_title?: string;

  @ApiPropertyOptional({ description: 'Meta description cho SEO' })
  @IsOptional()
  @IsString()
  meta_description?: string;

  @ApiPropertyOptional({ description: 'Open Graph image URL' })
  @IsOptional()
  @IsUrl()
  og_image_url?: string;

  @ApiPropertyOptional({ description: 'Social media metadata' })
  @IsOptional()
  social_media?: any;

  // Display options
  @ApiPropertyOptional({ description: 'Có phải bài viết nổi bật không' })
  @IsOptional()
  @IsBoolean()
  is_featured?: boolean;

  @ApiPropertyOptional({ description: 'Hiển thị trên trang chủ' })
  @IsOptional()
  @IsBoolean()
  show_on_homepage?: boolean;

  @ApiPropertyOptional({ description: 'Thời gian đọc ước tính (phút)' })
  @IsOptional()
  @IsNumber()
  reading_time_minutes?: number;

  @ApiPropertyOptional({ description: 'Các khối nội dung', type: 'array' })
  @IsOptional()
  @IsArray()
  postBlocks?: any[];
}

