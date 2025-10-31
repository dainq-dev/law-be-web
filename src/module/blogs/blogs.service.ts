import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BlogsRepository } from './blogs.repository';
import { PaginationOptions } from '@shared/utilities/pagination';
import { plainToClass } from 'class-transformer';
import { UploadService } from '@shared/services/upload.service';
import {
  CreateBlogDto,
  UpdateBlogDto,
  BlogResponseDto,
  UpdateStatusDto,
} from './dto';
import { BlogEntity } from '@shared/entities';

@Injectable()
export class BlogsService {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly uploadService: UploadService,
  ) {}

  // Blog methods
  async create(
    createBlogDto: CreateBlogDto,
  ): Promise<BlogResponseDto> {
    const { postBlocks, published_at, ...blogData } = createBlogDto;

    // Create blog with multilingual fields
    const blog = await this.blogsRepository.create({
      ...blogData,
      published_at: published_at ? new Date(published_at) : undefined,
    });

    // Create post blocks if provided
    if (postBlocks && postBlocks.length > 0) {
      for (const [index, block] of postBlocks.entries()) {
        await this.blogsRepository.createPostBlock({
          block_type: block.block_type,
          content: block.content,
          post_id: blog.id,
          order: block.order ?? index,
          is_featured: block.is_featured || false,
          metadata: block.metadata,
          css_class: block.css_class,
          style: block.style,
        });
      }
    }

    const savedBlog = await this.blogsRepository.findById(blog.id);
    if (!savedBlog) {
      throw new NotFoundException('Blog not found after creation');
    }
    return this.toBlogResponseDto(savedBlog);
  }

  async findAll(
    options: PaginationOptions & { 
      search?: string; 
      is_featured?: boolean;
    },
  ): Promise<{
    data: BlogEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const validatedOptions = {
      page: Math.max(1, options.page || 1),
      limit: Math.min(100, Math.max(1, options.limit || 10)),
      search: options.search,
      is_featured: options.is_featured,
    };

    const result = await this.blogsRepository.findAll(validatedOptions);

    return {
      data: result.data,
      total: result.total,
      page: validatedOptions.page,
      limit: validatedOptions.limit,
      totalPages: Math.ceil(result.total / validatedOptions.limit),
    };
  }

  async findOne(id: string): Promise<BlogResponseDto> {
    const blog = await this.blogsRepository.findById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return this.toBlogResponseDto(blog);
  }

  async findOneBySlug(slug: string): Promise<BlogResponseDto> {
    const blog = await this.blogsRepository.findBySlug(slug);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return this.toBlogResponseDto(blog);
  }

  async update(
    id: string,
    updateBlogDto: UpdateBlogDto,
  ): Promise<BlogResponseDto> {
    const blog = await this.blogsRepository.findById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const { postBlocks, published_at, ...blogData } = updateBlogDto;

    // Update blog with multilingual fields
    const updateData: any = { ...blogData };
    if (published_at) {
      updateData.published_at = new Date(published_at);
    }

    const updatedBlog = await this.blogsRepository.update(id, updateData);

    // Update post blocks if provided
    if (postBlocks && postBlocks.length > 0) {
      // Delete existing post blocks
      const existingBlog = await this.blogsRepository.findById(id);
      if (existingBlog && existingBlog.postBlocks) {
        for (const block of existingBlog.postBlocks) {
          await this.blogsRepository.deletePostBlock(block.id);
        }
      }

      // Create new post blocks
      for (const [index, block] of postBlocks.entries()) {
        await this.blogsRepository.createPostBlock({
          block_type: block.block_type,
          content: block.content,
          post_id: id,
          order: block.order ?? index,
          is_featured: block.is_featured || false,
          metadata: block.metadata,
          css_class: block.css_class,
          style: block.style,
        });
      }
    }

    if (!updatedBlog) {
      throw new NotFoundException('Blog not found after update');
    }

    return this.toBlogResponseDto(updatedBlog);
  }

  async remove(id: string): Promise<{ message: string }> {
    const blog = await this.blogsRepository.findById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    await this.blogsRepository.delete(id);
    return { message: 'Blog deleted successfully' };
  }

  // Category methods removed - CategoryEntity doesn't exist

  private toBlogResponseDto(blog: BlogEntity): any {
    const result = plainToClass(BlogResponseDto, blog, {
      excludeExtraneousValues: false,
    });
    return result;
  }

  // calculateReadingTime method removed - not needed without reading_time_minutes field

  // File upload methods
  async uploadImages(blogId: string, files: any[]): Promise<{ urls: string[]; message: string }> {
    const blog = await this.blogsRepository.findById(blogId);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const uploaded = await this.uploadService.uploadMultipleFiles(
      files,
      'images',
      ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    );

    return {
      urls: uploaded.map(file => file.url),
      message: `${uploaded.length} image(s) uploaded successfully`,
    };
  }

  async uploadDocuments(blogId: string, files: any[]): Promise<{ urls: string[]; message: string }> {
    const blog = await this.blogsRepository.findById(blogId);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
    ];

    const uploaded = await this.uploadService.uploadMultipleFiles(
      files,
      'documents',
      allowedTypes,
    );

    return {
      urls: uploaded.map(file => file.url),
      message: `${uploaded.length} document(s) uploaded successfully`,
    };
  }

  // Featured blogs methods
  async getFeaturedBlogs(limit: number = 5): Promise<BlogResponseDto[]> {
    const blogs = await this.blogsRepository.findFeaturedBlogs(limit);
    return blogs.map(blog => this.toBlogResponseDto(blog));
  }

  // getHomepageBlogs method removed - show_on_homepage field doesn't exist in entity

  // incrementViewCount method removed - view_count field doesn't exist in entity

  async incrementLikeCount(id: string): Promise<{ message: string }> {
    const blog = await this.blogsRepository.findById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    await this.blogsRepository.incrementLikeCount(id);
    return { message: 'Like count incremented successfully' };
  }

  async decrementLikeCount(id: string): Promise<{ message: string }> {
    const blog = await this.blogsRepository.findById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    await this.blogsRepository.decrementLikeCount(id);
    return { message: 'Like count decremented successfully' };
  }

  async updateStatus(id: string): Promise<BlogResponseDto> {
    const blog = await this.blogsRepository.findById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const updatePayload: Partial<BlogEntity> = { 
      is_active: !blog.is_active,
      published_at: blog.is_active ? blog.published_at : new Date()
    } as Partial<BlogEntity>;
    const updated = await this.blogsRepository.update(id, updatePayload);
    if (!updated) {
      throw new NotFoundException('Blog not found after status update');
    }
    return this.toBlogResponseDto(updated);
  }
}

