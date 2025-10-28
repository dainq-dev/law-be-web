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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BlogsService } from './blogs.service';
import {
  CreateBlogDto,
  UpdateBlogDto,
  BlogResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto';
import { PaginationDto } from '@shared/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '@module/auth/decorators/public.decorator';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Tạo bài viết mới' })
  @ApiResponse({ status: 201, type: BlogResponseDto })
  async create(@Body() createBlogDto: CreateBlogDto, @Req() req: any): Promise<BlogResponseDto> {
    return this.blogsService.create(createBlogDto, req.user.sub);
  }
  
  @Get()
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách bài viết' })
  async findAll(
    @Query() query: PaginationDto & { 
      search?: string; 
      category_id?: string; 
      is_featured?: boolean; 
      show_on_homepage?: boolean;
    },
  ) {
    return this.blogsService.findAll(query);
  }
  
  // Category endpoints - moved before @Get(':id') to avoid route conflict
  @Post('categories')
  @Public()
  @ApiOperation({ summary: 'Tạo danh mục mới' })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.blogsService.createCategory(createCategoryDto);
  }

  @Get('categories')
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách danh mục' })
  async findAllCategories(@Query() query: PaginationDto & { search?: string }) {
    return this.blogsService.findAllCategories(query);
  }
  
  @Get('categories/:id')
  @Public()
  @ApiOperation({ summary: 'Lấy chi tiết danh mục' })
  async findOneCategory(@Param('id') id: string) {
    return this.blogsService.findOneCategory(id);
  }
  
  @Patch('categories/:id')
  @Public()
  @ApiOperation({ summary: 'Cập nhật danh mục' })
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.blogsService.updateCategory(id, updateCategoryDto);
  }
  
  @Delete('categories/:id')
  @Public()
  @ApiOperation({ summary: 'Xóa danh mục' })
  async removeCategory(@Param('id') id: string) {
    return this.blogsService.removeCategory(id);
  }
  
  // Featured and homepage blogs - moved before @Get(':id') to avoid route conflict
  @Get('featured')
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách bài viết nổi bật' })
  @ApiResponse({ status: 200, type: [BlogResponseDto] })
  async getFeaturedBlogs(@Query('limit') limit?: number) {
    return this.blogsService.getFeaturedBlogs(limit);
  }
  
  @Get('homepage')
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách bài viết cho trang chủ' })
  @ApiResponse({ status: 200, type: [BlogResponseDto] })
  async getHomepageBlogs(@Query('limit') limit?: number) {
    return this.blogsService.getHomepageBlogs(limit);
  }
  
  // Blog CRUD endpoints - moved after specific routes to avoid conflicts
  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Lấy chi tiết bài viết' })
  @ApiResponse({ status: 200, type: BlogResponseDto })
  async findOne(@Param('id') id: string): Promise<BlogResponseDto> {
    console.log('❌ Route @Get(":id") is being called with id:', id);
    return this.blogsService.findOne(id);
  }
  
  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Cập nhật bài viết' })
  @ApiResponse({ status: 200, type: BlogResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<BlogResponseDto> {
    return this.blogsService.update(id, updateBlogDto);
  }
  
  @Delete(':id')
  @Public()
  @ApiOperation({ summary: 'Xóa bài viết' })
  async remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }
  
  // Engagement endpoints
  @Post(':id/view')
  @Public()
  @ApiOperation({ summary: 'Tăng lượt xem bài viết' })
  async incrementViewCount(@Param('id') id: string) {
    return this.blogsService.incrementViewCount(id);
  }
  
  @Post(':id/like')
  @Public()
  @ApiOperation({ summary: 'Tăng lượt thích bài viết' })
  async incrementLikeCount(@Param('id') id: string) {
    return this.blogsService.incrementLikeCount(id);
  }
  
  @Delete(':id/like')
  @Public()
  @ApiOperation({ summary: 'Giảm lượt thích bài viết' })
  async decrementLikeCount(@Param('id') id: string) {
    return this.blogsService.decrementLikeCount(id);
  }
  
  @Patch(':id/status')
  @ApiOperation({ summary: 'Toggle trạng thái active của bài viết' })
  @Public()
  @ApiResponse({ status: 200, description: 'Toggle status thành công' })
  async toggleActiveStatus(@Param('id') id: string) {
    return this.blogsService.toggleActiveStatus(id);
  }
}

