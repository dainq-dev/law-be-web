import { Expose, Type } from 'class-transformer';
import { PostBlockResponseDto } from './post-block.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BlogResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  slug: string;

  @ApiPropertyOptional()
  @Expose()
  excerpt?: string;

  @ApiPropertyOptional()
  @Expose()
  status?: string;

  @ApiPropertyOptional()
  @Expose()
  published_at?: Date;

  @ApiPropertyOptional()
  @Expose()
  category_id?: string;

  @ApiPropertyOptional()
  @Expose()
  author_id?: string;

  // Featured Image fields
  @ApiPropertyOptional()
  @Expose()
  featured_image_url?: string;

  @ApiPropertyOptional()
  @Expose()
  featured_image_alt?: string;

  // SEO fields
  @ApiPropertyOptional()
  @Expose()
  meta_title?: string;

  @ApiPropertyOptional()
  @Expose()
  meta_description?: string;

  @ApiPropertyOptional()
  @Expose()
  og_image_url?: string;

  @ApiPropertyOptional()
  @Expose()
  social_media?: any;

  // Display options
  @ApiPropertyOptional()
  @Expose()
  is_featured?: boolean;

  @ApiPropertyOptional()
  @Expose()
  show_on_homepage?: boolean;

  // Engagement metrics
  @ApiPropertyOptional()
  @Expose()
  view_count?: number;

  @ApiPropertyOptional()
  @Expose()
  like_count?: number;

  @ApiPropertyOptional()
  @Expose()
  reading_time_minutes?: number;

  @ApiProperty()
  @Expose()
  created_at: Date;

  @ApiProperty()
  @Expose()
  updated_at: Date;

  @ApiPropertyOptional()
  @Expose()
  @Type(() => PostBlockResponseDto)
  postBlocks?: PostBlockResponseDto[];

  @ApiPropertyOptional()
  @Expose()
  field?: string;

  @ApiPropertyOptional()
  @Expose()
  author?: any;
}

