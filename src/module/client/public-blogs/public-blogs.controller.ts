import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BlogResponseDto } from '../../blogs/dto/blog-response.dto';
import { PaginationDto } from '@shared/dto/pagination.dto';
import { PublicBlogsService } from './public-blogs.service';

@ApiTags('Public Blogs')
@Controller('public/blogs')
export class PublicBlogsController {
  constructor(private readonly publicBlogsService: PublicBlogsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bài viết công khai' })
  @ApiResponse({ status: 200, type: [BlogResponseDto] })
  async findAll(
    @Query() query: PaginationDto & { 
      search?: string; 
      category_id?: string; 
      is_featured?: boolean; 
      show_on_homepage?: boolean;
      field?: string;
    },
  ) {
    return this.publicBlogsService.findAll(query);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Lấy danh sách bài viết nổi bật' })
  @ApiResponse({ status: 200, type: [BlogResponseDto] })
  async getFeaturedBlogs(@Query('limit') limit?: number) {
    return this.publicBlogsService.getFeaturedBlogs(limit);
  }

  @Get('homepage')
  @ApiOperation({ summary: 'Lấy danh sách bài viết cho trang chủ' })
  @ApiResponse({ status: 200, type: [BlogResponseDto] })
  async getHomepageBlogs(@Query('limit') limit?: number) {
    return this.publicBlogsService.getHomepageBlogs(limit);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Lấy chi tiết bài viết theo slug' })
  @ApiResponse({ status: 200, type: BlogResponseDto })
  async findBySlug(@Param('slug') slug: string): Promise<BlogResponseDto> {
    return this.publicBlogsService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết bài viết theo ID' })
  @ApiResponse({ status: 200, type: BlogResponseDto })
  async findOne(@Param('id') id: string): Promise<BlogResponseDto> {
    return this.publicBlogsService.findOne(id);
  }

  @Get('categories/list')
  @ApiOperation({ summary: 'Lấy danh sách danh mục công khai' })
  async findAllCategories(@Query() query: PaginationDto & { search?: string }) {
    return this.publicBlogsService.findAllCategories(query);
  }

  // Engagement endpoints (public)
  @Get(':id/view')
  @ApiOperation({ summary: 'Tăng lượt xem bài viết' })
  async incrementViewCount(@Param('id') id: string) {
    return this.publicBlogsService.incrementViewCount(id);
  }
}
