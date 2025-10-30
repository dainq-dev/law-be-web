import { IsString, IsOptional, IsDateString, IsBoolean, IsArray } from 'class-validator';
import { CreatePostBlockDto } from './post-block.dto';

export class CreateBlogDto {
  // Title - all languages optional in entity, but typically required
  @IsString({ message: 'Title (VI) must be a string' })
  @IsOptional()
  title_vi?: string;

  @IsString({ message: 'Title (EN) must be a string' })
  @IsOptional()
  title_en?: string;

  @IsString({ message: 'Title (ZH) must be a string' })
  @IsOptional()
  title_zh?: string;

  @IsString({ message: 'Slug must be a string' })
  @IsOptional()
  slug?: string;

  // Excerpt - all languages optional
  @IsString({ message: 'Excerpt (VI) must be a string' })
  @IsOptional()
  excerpt_vi?: string;

  @IsString({ message: 'Excerpt (EN) must be a string' })
  @IsOptional()
  excerpt_en?: string;

  @IsString({ message: 'Excerpt (ZH) must be a string' })
  @IsOptional()
  excerpt_zh?: string;

  // Description - all languages optional
  @IsString({ message: 'Description (VI) must be a string' })
  @IsOptional()
  description_vi?: string;

  @IsString({ message: 'Description (EN) must be a string' })
  @IsOptional()
  description_en?: string;

  @IsString({ message: 'Description (ZH) must be a string' })
  @IsOptional()
  description_zh?: string;

  @IsString({ message: 'Status must be a string' })
  @IsOptional()
  status?: string; // draft, published, archived

  @IsDateString({}, { message: 'Published at must be a valid date' })
  @IsOptional()
  published_at?: string;

  @IsString({ message: 'Featured image URL must be a string' })
  @IsOptional()
  featured_image_url?: string;

  @IsString({ message: 'Featured image alt must be a string' })
  @IsOptional()
  featured_image_alt?: string;

  @IsBoolean({ message: 'Is featured must be a boolean' })
  @IsOptional()
  is_featured?: boolean;

  @IsArray()
  @IsOptional()
  postBlocks?: CreatePostBlockDto[];
}
