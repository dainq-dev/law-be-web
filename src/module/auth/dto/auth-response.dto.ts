import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class AuthAdminResponseDto {
  @ApiProperty({ description: 'Admin ID', example: 'uuid-string' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Admin email', example: 'admin@lawcompany.com' })
  @Expose()
  user_email: string;

  @ApiProperty({ description: 'Full name', example: 'John Doe' })
  @Expose()
  full_name: string;

  @ApiProperty({ description: 'Phone number', example: '+1234567890' })
  @Expose()
  phone_number: string;

  @ApiProperty({ description: 'Role information' })
  @Expose()
  role: {
    id: string;
    name: string;
    permissions: string;
  };

  @ApiProperty({ description: 'Admin permissions array' })
  @Expose()
  json_permission: string[];

  @ApiProperty({ description: 'Last login date' })
  @Expose()
  last_login_date: Date;

  @ApiProperty({ description: 'Is active status' })
  @Expose()
  is_active: boolean;

  @ApiProperty({ description: 'Is root admin' })
  @Expose()
  is_root: boolean;

  @Exclude()
  password: string;

  @Exclude()
  json_token: any[];

  @Exclude()
  refresh_token: string;

  @Exclude()
  reset_password_code: string;

  @Exclude()
  login_attempts: number;

  @Exclude()
  locked_until: Date;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'Access token for API authentication' })
  access_token: string;

  @ApiProperty({ description: 'Refresh token for getting new access token' })
  refresh_token: string;

  @ApiProperty({ description: 'Token expiration time in seconds' })
  expires_in: number;

  @ApiProperty({ description: 'Admin information' })
  admin: AuthAdminResponseDto;
}

export class RefreshTokenResponseDto {
  @ApiProperty({ description: 'New access token' })
  access_token: string;

  @ApiProperty({ description: 'New refresh token' })
  refresh_token: string;

  @ApiProperty({ description: 'Token expiration time in seconds' })
  expires_in: number;
}
