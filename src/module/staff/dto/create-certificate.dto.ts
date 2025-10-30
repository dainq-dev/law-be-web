import { IsString, IsOptional, IsDateString, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateCertificateDto {
  // Name - all languages required
  @IsString({ message: 'Name (VI) must be a string' })
  @IsNotEmpty({ message: 'Name (VI) is required' })
  name_vi: string;

  @IsString({ message: 'Name (EN) must be a string' })
  @IsNotEmpty({ message: 'Name (EN) is required' })
  name_en: string;

  @IsString({ message: 'Name (ZH) must be a string' })
  @IsNotEmpty({ message: 'Name (ZH) is required' })
  name_zh: string;

  // Issuing organization - all languages optional
  @IsString({ message: 'Issuing organization (VI) must be a string' })
  @IsOptional()
  issuing_organization_vi?: string;

  @IsString({ message: 'Issuing organization (EN) must be a string' })
  @IsOptional()
  issuing_organization_en?: string;

  @IsString({ message: 'Issuing organization (ZH) must be a string' })
  @IsOptional()
  issuing_organization_zh?: string;

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

  @IsOptional()
  @IsDateString({}, { message: 'Issue date must be a valid date' })
  issue_date?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Expiration date must be a valid date' })
  expiration_date?: string;

  @IsOptional()
  @IsString()
  credential_id?: string;

  @IsOptional()
  @IsString()
  credential_url?: string;

  @IsUUID('4', { message: 'Human resource ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Human resource ID is required' })
  human_resource_id: string;
}

