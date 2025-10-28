import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BlogResponseDto } from '../../blogs/dto/blog-response.dto';
import { PublicStaffService } from './staff.service';

@ApiTags('Public Staff')
@Controller('public/staff')
export class PublicStaffController {
  constructor(private readonly publicStaffsService: PublicStaffService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bài viết công khai' })
  @ApiResponse({ status: 200, type: [BlogResponseDto] })
  async findAll() {
    return this.publicStaffsService.findAll();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Lấy chi tiết bài viết theo slug' })
  @ApiResponse({ status: 200, type: BlogResponseDto })
  async findBySlug(@Param('id') id: string) {
    return this.publicStaffsService.findBySlug(id);
  }
}
