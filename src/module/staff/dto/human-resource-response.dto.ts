import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class HumanResourceResponseDto {
  @ApiProperty({ description: 'Human resource ID', example: 'uuid-string' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'First name', example: 'John' })
  @Expose()
  first_name: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  @Expose()
  last_name: string;

  @ApiProperty({ description: 'Full name', example: 'John Doe' })
  @Expose()
  full_name: string;

  @ApiProperty({ description: 'Position', example: 'Senior Lawyer' })
  @Expose()
  position: string;

  @ApiProperty({ description: 'Email', example: 'john.doe@lawcompany.com' })
  @Expose()
  email: string;

  @ApiProperty({ description: 'Phone number', example: '+1234567890' })
  @Expose()
  phone_number: string;

  @ApiProperty({ description: 'About information' })
  @Expose()
  about: string;

  @ApiProperty({ description: 'Location', example: 'New York, NY' })
  @Expose()
  location: string;

  @ApiProperty({ description: 'Avatar URL' })
  @Expose()
  avatar_url: string;

  @ApiProperty({ description: 'Department', example: 'Corporate Law' })
  @Expose()
  department: string;

  @ApiProperty({ description: 'Date of birth' })
  @Expose()
  date_of_birth: Date;

  @ApiProperty({ description: 'Gender', example: 'Male' })
  @Expose()
  gender: string;

  @ApiProperty({ description: 'Address' })
  @Expose()
  address: string;

  @ApiProperty({ description: 'Sort order' })
  @Expose()
  sort_order: number;

  @ApiProperty({ description: 'Is active status' })
  @Expose()
  is_active: boolean;

  @ApiProperty({ description: 'Is featured status' })
  @Expose()
  is_featured: boolean;

  @ApiProperty({ description: 'Company information' })
  @Expose()
  company: {
    id: string;
    name: string;
  };

  @ApiProperty({ description: 'Created at' })
  @Expose()
  created_at: Date;

  @ApiProperty({ description: 'Updated at' })
  @Expose()
  updated_at: Date;
}
