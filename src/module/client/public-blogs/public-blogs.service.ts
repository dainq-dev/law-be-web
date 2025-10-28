import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogResponseDto } from '../../blogs/dto/blog-response.dto';
import { PaginationDto } from '@shared/dto/pagination.dto';
import { PublicBlogsRepository } from './public-blogs.repository';

@Injectable()
export class PublicBlogsService {
  constructor(private readonly publicBlogsRepository: PublicBlogsRepository) {}

  async findAll(query: PaginationDto & { 
    search?: string; 
    category_id?: string; 
    is_featured?: boolean; 
    show_on_homepage?: boolean;
    field?: string;
  }) {
    // Chỉ lấy các bài viết đã published
    const filters = {
      ...query,
      status: 'published',
      is_active: true,
    };

    const result = await this.publicBlogsRepository.findAll(filters);
    return {
      ...result,
      data: result.data.map((blog) => this.transformBlogForClient(blog)),
    };
  }

  async findOne(id: string): Promise<BlogResponseDto> {
    const blog = await this.publicBlogsRepository.findOne(id);
    if (!blog) {
      throw new NotFoundException('Bài viết không tồn tại');
    }
    return this.transformBlogForClient(blog);
  }

  async findBySlug(slug: string): Promise<BlogResponseDto> {
    const blog = await this.publicBlogsRepository.findBySlug(slug);
    
    if (!blog) {
      throw new NotFoundException('Bài viết không tồn tại');
    }
    return this.transformBlogForClient(blog);
  }

  async getFeaturedBlogs(limit?: number) {
    return this.publicBlogsRepository.getFeaturedBlogs(limit);
  }

  async getHomepageBlogs(limit?: number) {
    return this.publicBlogsRepository.getHomepageBlogs(limit);
  }

  async findAllCategories(query: PaginationDto & { search?: string }) {
    return this.publicBlogsRepository.findAllCategories(query);
  }

  async incrementViewCount(id: string) {
    return this.publicBlogsRepository.incrementViewCount(id);
  }

  private transformBlogForClient(blog: any): BlogResponseDto {
    const transformed: any = { ...blog };
    if (Array.isArray(transformed.postBlocks)) {
      transformed.postBlocks = transformed.postBlocks
        .map((block: any) => ({
          id: block.id,
          type: block.type || block.block_type,
          content: block.content,
          order: typeof block.order === 'number' ? block.order : block.order_index ?? 0,
          order_index: typeof block.order === 'number' ? block.order : block.order_index ?? 0,
          style: block.style,
          is_featured: block.is_featured,
          metadata: block.metadata,
          css_class: block.css_class,
        }))
        .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
    }
    return transformed as BlogResponseDto;
  }
}
