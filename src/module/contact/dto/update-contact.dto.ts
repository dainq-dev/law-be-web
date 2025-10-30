import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateContactDto {
  @ApiPropertyOptional({ description: 'Ngày phản hồi' })
  @IsOptional()
  @IsDateString({}, { message: 'Responded at must be a valid date' })
  responded_at?: string;
}

