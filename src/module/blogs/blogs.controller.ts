import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BlogsService } from './blogs.service';
import {
  CreateBlogDto,
  UpdateBlogDto,
  BlogResponseDto,
  UpdateStatusDto,
} from './dto';
import { PaginationDto } from '@shared/dto/pagination.dto';
import { Public } from '@module/auth/decorators/public.decorator';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Tạo bài viết mới' })
  @ApiResponse({ status: 201, type: BlogResponseDto })
  async create(@Body() createBlogDto: CreateBlogDto): Promise<BlogResponseDto> {
    return this.blogsService.create(createBlogDto);
  }
  
  @Get()
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách bài viết' })
  async findAll(
    @Query() query: PaginationDto & { 
      search?: string; 
      is_featured?: boolean;
    },
  ) {
    return this.blogsService.findAll(query);
  }
  
  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Lấy chi tiết bài viết theo slug' })
  @ApiResponse({ status: 200, type: BlogResponseDto })
  async findOneBySlug(@Param('slug') slug: string): Promise<BlogResponseDto> {
    return this.blogsService.findOneBySlug(slug);
  }

  // Featured blogs - moved before @Get(':id') to avoid route conflict
  @Get('featured')
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách bài viết nổi bật' })
  @ApiResponse({ status: 200, type: [BlogResponseDto] })
  async getFeaturedBlogs(@Query('limit') limit?: number) {
    return this.blogsService.getFeaturedBlogs(limit);
  }
  
  // Placeholder for categories endpoint to avoid conflicting with :id
  @Get('categories')
  @Public()
  @ApiOperation({ summary: 'Danh mục bài viết (tạm thời trống)' })
  async getCategories(): Promise<{ data: any[]; message: string }> {
    return { data: [], message: 'Categories not implemented' };
  }
  
  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Lấy chi tiết bài viết' })
  @ApiResponse({ status: 200, type: BlogResponseDto })
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<BlogResponseDto> {
    return this.blogsService.findOne(id);
  }
  
  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Cập nhật bài viết' })
  @ApiResponse({ status: 200, type: BlogResponseDto })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<BlogResponseDto> {
    return this.blogsService.update(id, updateBlogDto);
  }
  
  @Delete(':id')
  @Public()
  @ApiOperation({ summary: 'Xóa bài viết' })
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.blogsService.remove(id);
  }
  
  // Engagement endpoints
  @Post(':id/like')
  @Public()
  @ApiOperation({ summary: 'Tăng lượt thích bài viết' })
  async incrementLikeCount(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.blogsService.incrementLikeCount(id);
  }
  
  @Delete(':id/like')
  @Public()
  @ApiOperation({ summary: 'Giảm lượt thích bài viết' })
  async decrementLikeCount(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.blogsService.decrementLikeCount(id);
  }

  //update is_active status blog:  /:id/status
  @Patch(':id/status')
  @Public()
  @ApiOperation({ summary: 'Cập nhật trạng thái bài viết' })
  async updateStatus(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.blogsService.updateStatus(id);
  }
}

