import { IsString, IsOptional, IsDate, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCertificateDto {
  @ApiProperty({ description: 'Tên chứng chỉ' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Tổ chức cấp' })
  @IsOptional()
  @IsString()
  issuing_organization?: string;

  @ApiPropertyOptional({ description: 'Ngày cấp' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  issue_date?: Date;

  @ApiPropertyOptional({ description: 'Ngày hết hạn' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiration_date?: Date;

  @ApiPropertyOptional({ description: 'Mã chứng chỉ' })
  @IsOptional()
  @IsString()
  credential_id?: string;

  @ApiPropertyOptional({ description: 'URL xác thực chứng chỉ' })
  @IsOptional()
  @IsString()
  credential_url?: string;

  @ApiPropertyOptional({ description: 'Mô tả' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'ID nhân sự' })
  @IsUUID()
  human_resource_id: string;
}

