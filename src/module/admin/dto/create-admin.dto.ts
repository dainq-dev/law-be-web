import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsUUID, IsBoolean, MinLength, IsArray } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    description: 'Email address of the admin',
    example: 'admin@lawcompany.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  user_email: string;

  @ApiProperty({
    description: 'Password for the admin account',
    example: 'password123',
    minLength: 6,
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({
    description: 'Full name of the admin',
    example: 'John Doe',
  })
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  full_name: string;

  @ApiProperty({
    description: 'Phone number of the admin',
    example: '+1234567890',
    required: false,
  })
  @IsString({ message: 'Phone number must be a string' })
  @IsOptional()
  phone_number?: string;

  @ApiProperty({
    description: 'Role ID for the admin',
    example: 'uuid-string',
  })
  @IsUUID('4', { message: 'Role ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Role ID is required' })
  role_id: string;

  @ApiProperty({
    description: 'Array of permission IDs',
    example: ['permission1', 'permission2'],
    required: false,
  })
  @IsArray({ message: 'Permissions must be an array' })
  @IsString({ each: true, message: 'Each permission must be a string' })
  @IsOptional()
  json_permission?: string[];

  @ApiProperty({
    description: 'Whether the admin is active',
    example: true,
    required: false,
  })
  @IsBoolean({ message: 'Is active must be a boolean' })
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    description: 'Whether the admin is root',
    example: false,
    required: false,
  })
  @IsBoolean({ message: 'Is root must be a boolean' })
  @IsOptional()
  is_root?: boolean;
}
