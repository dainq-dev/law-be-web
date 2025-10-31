import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, ArrayMinSize, ValidateNested, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpsertWebConfigItemDto {
  @ApiProperty({ description: 'Key của config (unique theo key+screen)' })
  @IsString()
  key: string;

  @ApiPropertyOptional({ description: 'Tên màn hình (vd: base, homepage, services, ...)' })
  @IsOptional()
  @IsString()
  screen?: string;

  @ApiPropertyOptional({ description: 'Giá trị (dùng cho màu sắc/URL hoặc fallback nếu không có content)' })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({ description: 'Giá trị nội dung đa ngôn ngữ (JSON string)' })
  @IsOptional()
  @IsString()
  content?: string;
}

export class UpsertWebConfigDto {
  @ApiProperty({ type: [UpsertWebConfigItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpsertWebConfigItemDto)
  items: UpsertWebConfigItemDto[];
}


