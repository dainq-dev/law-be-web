import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HomepageService } from './homepage.service';
import { HomepageStatsDto, HomepageDataDto } from './dto';
import { Public } from '../../auth/decorators/public.decorator';

@Controller('public/home')
export class HomepageController {
  constructor(private readonly homepageService: HomepageService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lấy toàn bộ dữ liệu trang chủ' })
  @ApiResponse({
    status: 200,
    description: 'Homepage data retrieved successfully',
    type: HomepageDataDto,
  })
  async getHomepageData(): Promise<HomepageDataDto> {
    return this.homepageService.getHomepageData();
  }

  @Get('stats')
  @Public()
  @ApiOperation({ summary: 'Lấy thống kê tổng quan' })
  @ApiResponse({
    status: 200,
    description: 'Homepage stats retrieved successfully',
    type: HomepageStatsDto,
  })
  async getHomepageStats(): Promise<HomepageStatsDto> {
    return this.homepageService.getHomepageStats();
  }

  @Get('config')
  @Public()
  @ApiOperation({ summary: 'Lấy thống kê tổng quan' })
  @ApiResponse({
    status: 200,
    description: 'Homepage stats retrieved successfully',
    type: HomepageStatsDto,
  })
  async getconfig(@Query('key') key: string): Promise<any> {
    return this.homepageService.getConfigByScreen(key);
  }

  @Get('services')
  @Public()
  @ApiOperation({ summary: 'Lấy thống kê tổng quan' })
  @ApiResponse({
    status: 200,
    description: 'Homepage stats retrieved successfully',
  })
  async getconfigByKey(): Promise<any> {
    return this.homepageService.getServices();

  }
}

