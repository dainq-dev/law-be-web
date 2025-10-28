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
    description: 'Tỉ lệ thành công (%)',
    example: 95,
  })
  @Expose()
  success_rate: number;

  @ApiProperty({
    description: 'Độ hài lòng khách hàng (%)',
    example: 98,
  })
  @Expose()
  client_satisfaction: number;

  @ApiProperty({
    description: 'Tổng số bài viết',
    example: 10,
  })
  @Expose()
  total_blog_posts: number;
}

