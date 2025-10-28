import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Name of the role',
    example: 'Manager',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    description: 'Permissions for the role (JSON string)',
    example: '["user:read", "user:write", "admin:read"]',
    required: false,
  })
  @IsString({ message: 'Permissions must be a string' })
  @IsOptional()
  permissions?: string;
}
