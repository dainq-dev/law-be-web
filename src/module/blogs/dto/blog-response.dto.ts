import { Expose, Type } from 'class-transformer';
import { PostBlockResponseDto } from './post-block.dto';

export class BlogResponseDto {
  @Expose()
  id: string;

  @Expose()
  title_vi?: string;

  @Expose()
  title_en?: string;

  @Expose()
  title_zh?: string;

  @Expose()
  slug: string;

  @Expose()
  excerpt_vi?: string;

  @Expose()
  excerpt_en?: string;

  @Expose()
  excerpt_zh?: string;

  @Expose()
  description_vi?: string;

  @Expose()
  description_en?: string;

  @Expose()
  description_zh?: string;

  @Expose()
  status?: string;

  @Expose()
  published_at?: Date;

  @Expose()
  featured_image_url?: string;

  @Expose()
  featured_image_alt?: string;

  @Expose()
  is_featured?: boolean;

  @Expose()
  like_count: number;

  @Expose()
  @Type(() => PostBlockResponseDto)
  postBlocks?: PostBlockResponseDto[];

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
