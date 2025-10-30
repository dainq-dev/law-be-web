import { IsString, IsOptional, IsNumber, IsBoolean, IsObject, IsUUID } from 'class-validator';

export class CreatePostBlockDto {
  @IsString({ message: 'Block type must be a string' })
  block_type: string;

  // Content - all languages optional (as JSON objects)
  @IsObject({ message: 'Content (VI) must be an object' })
  @IsOptional()
  content?: any;

  @IsNumber({}, { message: 'Order must be a number' })
  @IsOptional()
  order?: number;

  @IsBoolean({ message: 'Is featured must be a boolean' })
  @IsOptional()
  is_featured?: boolean;

  @IsObject({ message: 'Metadata must be an object' })
  @IsOptional()
  metadata?: any;

  @IsString({ message: 'CSS class must be a string' })
  @IsOptional()
  css_class?: string;

  @IsObject({ message: 'Style must be an object' })
  @IsOptional()
  style?: any;

  @IsUUID('4', { message: 'Post ID must be a valid UUID' })
  @IsOptional()
  post_id?: string;
}

export class UpdatePostBlockDto {
  @IsString({ message: 'Block type must be a string' })
  @IsOptional()
  block_type?: string;

  // Content - all languages optional
  @IsObject({ message: 'Content (VI) must be an object' })
  @IsOptional()
  content?: any;

  @IsNumber({}, { message: 'Order must be a number' })
  @IsOptional()
  order?: number;

  @IsBoolean({ message: 'Is featured must be a boolean' })
  @IsOptional()
  is_featured?: boolean;

  @IsObject({ message: 'Metadata must be an object' })
  @IsOptional()
  metadata?: any;

  @IsString({ message: 'CSS class must be a string' })
  @IsOptional()
  css_class?: string;

  @IsObject({ message: 'Style must be an object' })
  @IsOptional()
  style?: any;
}

export class PostBlockResponseDto {
  id: string;
  block_type: string;
  content?: any;
  order: number;
  is_featured?: boolean;
  metadata?: any;
  css_class?: string;
  style?: any;
  post_id: string;
  created_at: Date;
  updated_at: Date;
}
