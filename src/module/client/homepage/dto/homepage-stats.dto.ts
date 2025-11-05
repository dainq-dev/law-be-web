import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class HomepageStatsDto {
  @ApiProperty({
    description: 'Tổng số nhân sự',
    example: 25,
  })
  @Expose()
  total_human_resources: number;

  @ApiProperty({
    description: 'Tổng số dịch vụ',
    example: 10,
  })
  @Expose()
  total_services: number;

  @ApiProperty({
    description: 'Tổng số liên hệ',
    example: 10,
  })
  @Expose()
  total_contacts: number;

  @ApiProperty({
    description: 'Tổng số bài viết',
    example: 10,
  })
  @Expose()
  total_blog_posts: number;
}

