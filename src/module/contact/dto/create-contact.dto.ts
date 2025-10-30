import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';

export class CreateContactDto {
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  full_name: string;
  
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
  
  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  phone_number?: string;
  
  @IsOptional()
  @IsString({ message: 'Subject must be a string' })
  subject?: string;
  
  @IsString({ message: 'Message must be a string' })
  @IsNotEmpty({ message: 'Message is required' })
  message: string;
  
  @IsOptional()
  @IsString({ message: 'Company must be a string' })
  company?: string;
}

