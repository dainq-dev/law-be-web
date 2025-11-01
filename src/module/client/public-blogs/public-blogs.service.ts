import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { BlogResponseDto } from '../../blogs/dto/blog-response.dto';
import { PaginationDto } from '@shared/dto/pagination.dto';
import { PublicBlogsRepository } from './public-blogs.repository';
import { CommonRepository } from '../common/common.repository';

@Injectable()
export class PublicBlogsService {
  constructor(
    private readonly publicBlogsRepository: PublicBlogsRepository,
    private readonly commonRepository: CommonRepository,
  ) {}

  /**
   * Check website enabled trước khi thực hiện các thao tác
   */
  private async checkWebsiteEnabled(): Promise<void> {
    const isEnabled = await this.commonRepository.isWebsiteEnabled();
    if (!isEnabled) {
      throw new ServiceUnavailableException(
        'Website is currently disabled. Please contact the administrator.',
      );
    }
  }

  async findAll(query: PaginationDto & { 
    search?: string; 
    is_featured?: boolean;
  }) {
    await this.checkWebsiteEnabled();
    
    // Chỉ lấy các bài viết đã published
    const filters = {
      ...query,
      status: 'published',
    };

    const result = await this.publicBlogsRepository.findAll(filters);
    return {
      ...result,
      data: result.data.map((blog) => this.transformBlogForClient(blog)),
    };
  }

  async findOne(id: string): Promise<BlogResponseDto> {
    await this.checkWebsiteEnabled();
    
    const blog = await this.publicBlogsRepository.findOne(id);
    if (!blog) {
      throw new NotFoundException('Bài viết không tồn tại');
    }
    return this.transformBlogForClient(blog);
  }

  async findBySlug(slug: string): Promise<BlogResponseDto> {
    await this.checkWebsiteEnabled();
    
    const blog = await this.publicBlogsRepository.findBySlug(slug);
    
    if (!blog) {
      throw new NotFoundException('Bài viết không tồn tại');
    }
    return this.transformBlogForClient(blog);
  }

  async getFeaturedBlogs(limit?: number) {
    await this.checkWebsiteEnabled();
    const blogs = await this.publicBlogsRepository.getFeaturedBlogs(limit);
    return blogs.map(blog => this.transformBlogForClient(blog));
  }

  private transformBlogForClient(blog: any): BlogResponseDto {
    const transformed: any = { ...blog };
    if (Array.isArray(transformed.postBlocks)) {
      transformed.postBlocks = transformed.postBlocks
        .map((block: any) => ({
          id: block.id,
          block_type: block.block_type,
          content: block.content,
          order: typeof block.order === 'number' ? block.order : 0,
          is_featured: block.is_featured,
          metadata: block.metadata,
          css_class: block.css_class,
          style: block.style,
        }))
        .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
    }
    return transformed as BlogResponseDto;
  }
}
