import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'Name of the permission',
    example: 'user:read',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    description: 'Unique permission ID',
    example: 'user:read',
  })
  @IsString({ message: 'Permission ID must be a string' })
  @IsNotEmpty({ message: 'Permission ID is required' })
  permission_id: string;

  @ApiProperty({
    description: 'Description of the permission',
    example: 'Read user information',
    required: false,
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Whether the permission is active',
    example: true,
    required: false,
  })
  @IsBoolean({ message: 'Is active must be a boolean' })
  @IsOptional()
  isActive?: boolean;
}
