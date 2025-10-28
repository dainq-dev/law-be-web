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
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto';
import { BlogEntity, CategoryEntity } from '@shared/entities';

@Injectable()
export class BlogsService {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly uploadService: UploadService,
  ) {}

  // Blog methods
  async create(
    createBlogDto: CreateBlogDto,
    adminId: string,
  ): Promise<BlogResponseDto> {
    const { field, postBlocks, ...blogData } = createBlogDto;

    // Store field as text field (no validation needed)
    const finalField = field && field.trim() !== '' ? field : undefined;

    // Calculate reading time if not provided
    const readingTime = blogData.reading_time_minutes || this.calculateReadingTime(postBlocks || []);

    // Create blog
    const blog = await this.blogsRepository.create({
      ...blogData,
      field: finalField,
      author_id: adminId,
      reading_time_minutes: readingTime,
      meta_title: blogData.title,
      meta_description: blogData.excerpt,
      og_image_url: blogData.featured_image_url,
      social_media: blogData.social_media,
    });

    // Create post blocks if provided
    if (postBlocks && postBlocks.length > 0) {
      for (const [index, block] of postBlocks.entries()) {
        await this.blogsRepository.createPostBlock({
          block_type: block.type || block.block_type,
          content: block.content,
          post_id: blog.id,
          order: index,
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
      category_id?: string; 
      is_featured?: boolean; 
      show_on_homepage?: boolean;
    },
  ): Promise<{
    data: BlogResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const validatedOptions = {
      page: Math.max(1, options.page || 1),
      limit: Math.min(100, Math.max(1, options.limit || 10)),
      search: options.search,
      category_id: options.category_id,
      is_featured: options.is_featured,
      show_on_homepage: options.show_on_homepage,
    };

    const result = await this.blogsRepository.findAll(validatedOptions);

    return {
      data: result.data.map((blog) => this.toBlogResponseDto(blog)),
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

  async update(
    id: string,
    updateBlogDto: UpdateBlogDto,
  ): Promise<BlogResponseDto> {
    const blog = await this.blogsRepository.findById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const { field, postBlocks, ...blogData } = updateBlogDto;

    // Store field as text field (no validation needed)
    const finalField = field && field.trim() !== '' ? field : undefined;

    // Calculate reading time if postBlocks are provided
    const readingTime = blogData.reading_time_minutes || 
      (postBlocks ? this.calculateReadingTime(postBlocks) : undefined);

    // Update blog
    const updatedBlog = await this.blogsRepository.update(id, {
      ...blogData,
      field: finalField,
      reading_time_minutes: readingTime,
      meta_title: blogData.title,
      meta_description: blogData.excerpt,
      og_image_url: blogData.featured_image_url,
      social_media: blogData.social_media,
    });

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
          block_type: block.type || block.block_type,
          content: block.content,
          post_id: id,
          order: index,
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

  // Category methods
  async createCategory(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    return this.blogsRepository.createCategory(createCategoryDto);
  }

  async findAllCategories(
    options: PaginationOptions & { search?: string },
  ): Promise<{
    data: CategoryEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const validatedOptions = {
      page: Math.max(1, options.page || 1),
      limit: Math.min(100, Math.max(1, options.limit || 10)),
      search: options.search,
    };

    const result = await this.blogsRepository.findAllCategories(validatedOptions);

    return {
      ...result,
      page: validatedOptions.page,
      limit: validatedOptions.limit,
      totalPages: Math.ceil(result.total / validatedOptions.limit),
    };
  }

  async findOneCategory(id: string): Promise<CategoryEntity> {
    const category = await this.blogsRepository.findCategoryById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = await this.blogsRepository.findCategoryById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const updatedCategory = await this.blogsRepository.updateCategory(id, updateCategoryDto);
    if (!updatedCategory) {
      throw new NotFoundException('Category not found after update');
    }

    return updatedCategory;
  }

  async removeCategory(id: string): Promise<{ message: string }> {
    const category = await this.blogsRepository.findCategoryById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.blogsRepository.deleteCategory(id);
    return { message: 'Category deleted successfully' };
  }

  private toBlogResponseDto(blog: BlogEntity): BlogResponseDto {
    const result = plainToClass(BlogResponseDto, blog, {
      excludeExtraneousValues: false,
    });
    return result;
  }

  private calculateReadingTime(postBlocks: any[]): number {
    if (!postBlocks || postBlocks.length === 0) return 0;
    
    let totalWords = 0;
    const wordsPerMinute = 200; // Average reading speed
    
    postBlocks.forEach(block => {
      if (block.content) {
        if (block.content.text) {
          totalWords += block.content.text.split(' ').length;
        }
        if (block.content.items && Array.isArray(block.content.items)) {
          block.content.items.forEach(item => {
            if (typeof item === 'string') {
              totalWords += item.split(' ').length;
            }
          });
        }
      }
    });
    
    return Math.ceil(totalWords / wordsPerMinute);
  }

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

  async getHomepageBlogs(limit: number = 10): Promise<BlogResponseDto[]> {
    const blogs = await this.blogsRepository.findHomepageBlogs(limit);
    return blogs.map(blog => this.toBlogResponseDto(blog));
  }

  // Engagement methods
  async incrementViewCount(id: string): Promise<{ message: string }> {
    const blog = await this.blogsRepository.findById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    await this.blogsRepository.incrementViewCount(id);
    return { message: 'View count incremented successfully' };
  }

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

  async toggleActiveStatus(id: string): Promise<{ message: string; is_active: boolean }> {
    const blog = await this.blogsRepository.findById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const newStatus = !blog.is_active;
    await this.blogsRepository.update(id, { is_active: newStatus });
    
    return { 
      message: `Blog ${newStatus ? 'activated' : 'deactivated'} successfully`,
      is_active: newStatus 
    };
  }
}

