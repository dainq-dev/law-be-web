import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { HomepageStatsDto } from './homepage-stats.dto';

export class CompanyInfoDto {
  @ApiProperty({ description: 'Tên công ty' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Slogan' })
  @Expose()
  slogan: string;

  @ApiProperty({ description: 'Mô tả công ty' })
  @Expose()
  description: string;

  @ApiProperty({ description: 'Logo URL' })
  @Expose()
  logo_url: string;

  @ApiProperty({ description: 'Thông tin liên hệ' })
  @Expose()
  contact_info: {
    phone: string;
    email: string;
    address: string;
  };
}

export class HomepageDataDto {
  @ApiProperty({
    description: 'Thống kê tổng quan',
    type: HomepageStatsDto,
  })
  @Expose()
  @Type(() => HomepageStatsDto)
  stats: HomepageStatsDto;

  @ApiProperty({
    description: 'Nhân sự nổi bật',
    type: 'array',
  })
  @Expose()
  featured_human_resources: any[];

  @ApiProperty({
    description: 'Dịch vụ nổi bật',
    type: 'array',
  })
  @Expose()
  featured_services: any[];

  @ApiProperty({
    description: 'Bài viết gần đây',
    type: 'array',
  })
  @Expose()
  recent_blog_posts: any[];

  @ApiProperty({
    description: 'Testimonials khách hàng',
    type: 'array',
  })
  @Expose()
  client_testimonials: any[];

  @ApiProperty({
    description: 'Thông tin công ty',
    type: CompanyInfoDto,
  })
  @Expose()
  @Type(() => CompanyInfoDto)
  company_info: CompanyInfoDto;
}

