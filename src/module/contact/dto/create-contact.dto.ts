import { IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
  @IsOptional()
  @IsString({ message: 'Full name must be a string' })
  full_name: string;
  
  @IsOptional()
  @IsString({ message: 'Email must be a string' })
  email: string;
  
  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  phone_number?: string;
  
  @IsOptional()
  @IsString({ message: 'Subject must be a string' })
  subject?: string;
  
  @IsOptional()
  @IsString({ message: 'Message must be a string' })
  message: string;
  
  @IsOptional()
  @IsString({ message: 'Company must be a string' })
  company?: string;
}

