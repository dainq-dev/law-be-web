import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWebConfigDto {
  @ApiProperty({ description: 'Key của config' })
  @IsString()
  key: string;

  @ApiPropertyOptional({ description: 'Giá trị của config' })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({ description: 'Tên màn hình' })
  @IsOptional()
  @IsString()
  screen?: string;
}

