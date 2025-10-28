import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateContactDto {
  @ApiPropertyOptional({ description: 'Trạng thái' })
  @IsOptional()
  @IsString()
  status?: string; // pending, processing, completed, rejected

  @ApiPropertyOptional({ description: 'Ghi chú của admin' })
  @IsOptional()
  @IsString()
  admin_note?: string;
}

