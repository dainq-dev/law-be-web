import { IsString, IsOptional, IsNumber, IsBoolean, IsObject, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreatePostBlockDto {
  @ApiProperty({ description: 'Loại block', enum: ['text', 'heading', 'image', 'quote', 'list', 'video', 'code', 'divider'] })
  @IsString()
  block_type: string;

  @ApiProperty({ description: 'Nội dung block' })
  @IsObject()
  content: any;

  @ApiProperty({ description: 'Thứ tự sắp xếp' })
  @IsNumber()
  order: number;

  @ApiPropertyOptional({ description: 'Có phải block nổi bật không' })
  @IsOptional()
  @IsBoolean()
  is_featured?: boolean;

  @ApiPropertyOptional({ description: 'Metadata bổ sung' })
  @IsOptional()
  @IsObject()
  metadata?: any;

  @ApiPropertyOptional({ description: 'CSS class tùy chỉnh' })
  @IsOptional()
  @IsString()
  css_class?: string;

  @ApiPropertyOptional({ description: 'Style inline' })
  @IsOptional()
  @IsObject()
  style?: any;

  @ApiProperty({ description: 'ID bài viết' })
  @IsUUID()
  post_id: string;
}

export class UpdatePostBlockDto {
  @ApiPropertyOptional({ description: 'Loại block' })
  @IsOptional()
  @IsString()
  block_type?: string;

  @ApiPropertyOptional({ description: 'Nội dung block' })
  @IsOptional()
  @IsObject()
  content?: any;

  @ApiPropertyOptional({ description: 'Thứ tự sắp xếp' })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiPropertyOptional({ description: 'Có phải block nổi bật không' })
  @IsOptional()
  @IsBoolean()
  is_featured?: boolean;

  @ApiPropertyOptional({ description: 'Metadata bổ sung' })
  @IsOptional()
  @IsObject()
  metadata?: any;

  @ApiPropertyOptional({ description: 'CSS class tùy chỉnh' })
  @IsOptional()
  @IsString()
  css_class?: string;

  @ApiPropertyOptional({ description: 'Style inline' })
  @IsOptional()
  @IsObject()
  style?: any;
}

export class PostBlockResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  block_type: string;

  @ApiProperty()
  @Expose()
  content: any;

  @ApiProperty()
  @Expose()
  order: number;

  @ApiPropertyOptional()
  @Expose()
  is_featured?: boolean;

  @ApiPropertyOptional()
  @Expose()
  metadata?: any;

  @ApiPropertyOptional()
  @Expose()
  css_class?: string;

  @ApiPropertyOptional()
  @Expose()
  style?: any;

  @ApiProperty()
  @Expose()
  post_id: string;

  @ApiProperty()
  @Expose()
  created_at: Date;

  @ApiProperty()
  @Expose()
  updated_at: Date;
}
