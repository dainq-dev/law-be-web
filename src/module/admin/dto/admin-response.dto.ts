import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class AdminResponseDto {
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

  @ApiProperty({ description: 'Password last update date' })
  @Expose()
  password_last_update: Date;

  @ApiProperty({ description: 'Is active status' })
  @Expose()
  is_active: boolean;

  @ApiProperty({ description: 'Is root admin' })
  @Expose()
  is_root: boolean;

  @ApiProperty({ description: 'Is first account' })
  @Expose()
  is_first_account: boolean;

  @ApiProperty({ description: 'Created at' })
  @Expose()
  created_at: Date;

  @ApiProperty({ description: 'Updated at' })
  @Expose()
  updated_at: Date;

  @Exclude()
  password: string;

  @Exclude()
  json_token: any[];

  @Exclude()
  refresh_token: string;

  @Exclude()
  reset_password_code: string;

  @Exclude()
  reset_password_expires: Date;

  @Exclude()
  login_attempts: number;

  @Exclude()
  locked_until: Date;

  @Exclude()
  expiresIn: number;

  @Exclude()
  refresh_token_expires: Date;
}
