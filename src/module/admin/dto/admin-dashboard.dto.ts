import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class  AdminDashboardStatsDto {
  @ApiProperty({ description: 'Tổng số quản trị viên' })
  @Expose()
  total_admins: number;

  @ApiProperty({ description: 'Tổng số nhân sự' })
  @Expose()
  total_staff: number;

  @ApiProperty({ description: 'Tổng số dịch vụ' })
  @Expose()
  total_services: number;

  @ApiProperty({ description: 'Tổng số bài viết' })
  @Expose()
  total_blogs: number;

  @ApiProperty({ description: 'Tổng số liên hệ' })
  @Expose()
  total_contacts: number;

  @ApiProperty({ description: 'Số liên hệ pending' })
  @Expose()
  pending_contacts: number;

  @ApiProperty({ description: 'Số liên hệ mới trong 7 ngày' })
  @Expose()
  new_contacts_week: number;
}

export class AdminDashboardDataDto {
  @ApiProperty({ description: 'Thống kê tổng quan', type: AdminDashboardStatsDto })
  @Expose()
  stats: AdminDashboardStatsDto;

  @ApiProperty({ description: 'Hoạt động gần đây', type: 'array' })
  @Expose()
  recent_activities: any[];

  @ApiProperty({ description: 'Liên hệ gần đây', type: 'array' })
  @Expose()
  recent_contacts: any[];

  @ApiProperty({ description: 'Bài viết gần đây', type: 'array' })
  @Expose()
  recent_blogs: any[];
}

