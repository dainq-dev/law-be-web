import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { BlogEntity, CategoryEntity } from '@shared/entities';
import { BlogResponseDto } from '../../blogs/dto/blog-response.dto';
import { PaginationDto } from '@shared/dto/pagination.dto';

@Injectable()
export class PublicBlogsRepository {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findAll(query: PaginationDto & { 
    search?: string; 
    category_id?: string; 
    is_featured?: boolean; 
    show_on_homepage?: boolean;
    field?: string;
    status?: string;
  }) {
    const queryBuilder = this.createBaseQuery();
    if (query.search) {
      queryBuilder.andWhere(
        '(blog.title ILIKE :search OR blog.excerpt ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    if (query.category_id) {
      queryBuilder.andWhere('blog.category_id = :category_id', { 
        category_id: query.category_id 
      });
    }

    if (query.is_featured !== undefined) {
      queryBuilder.andWhere('blog.is_featured = :is_featured', { 
        is_featured: query.is_featured 
      });
    }

    if (query.show_on_homepage !== undefined) {
      queryBuilder.andWhere('blog.show_on_homepage = :show_on_homepage', { 
        show_on_homepage: query.show_on_homepage 
      });
    }

    if (query.field) {
      queryBuilder.andWhere('blog.field = :field', { field: query.field });
    }

    if (query.status) {
      queryBuilder.andWhere('blog.status = :status', { status: query.status });
    }

    // Apply pagination
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder
      .orderBy('blog.published_at', 'DESC')
      .addOrderBy('blog.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    const [blogs, total] = await queryBuilder.getManyAndCount();

    return {
      data: blogs.map(blog => plainToClass(BlogResponseDto, blog, { excludeExtraneousValues: true })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<BlogResponseDto | null> {
    const queryBuilder = this.createBaseQuery();
    queryBuilder.where('blog.id = :id', { id });
    
    const blog = await queryBuilder.getOne();
    return blog ? plainToClass(BlogResponseDto, blog, { excludeExtraneousValues: true }) : null;
  }

  async findBySlug(slug: string): Promise<BlogResponseDto | null> {
    const queryBuilder = this.createBaseQuery();
    queryBuilder.where('blog.slug = :slug', { slug });
    
    const blog = await queryBuilder.getOne();
    return blog ? plainToClass(BlogResponseDto, blog, { excludeExtraneousValues: true }) : null;
  }

  async getFeaturedBlogs(limit?: number) {
    const queryBuilder = this.createBaseQuery();
    
    queryBuilder
      .where('blog.is_featured = :is_featured', { is_featured: true })
      .andWhere('blog.status = :status', { status: 'published' })
      .orderBy('blog.published_at', 'DESC')
      .addOrderBy('blog.created_at', 'DESC');

    if (limit) {
      queryBuilder.take(limit);
    }

    const blogs = await queryBuilder.getMany();
    return blogs.map(blog => plainToClass(BlogResponseDto, blog, { excludeExtraneousValues: true }));
  }

  async getHomepageBlogs(limit?: number) {
    const queryBuilder = this.createBaseQuery();
    
    queryBuilder
      .where('blog.show_on_homepage = :show_on_homepage', { show_on_homepage: true })
      .andWhere('blog.status = :status', { status: 'published' })
      .orderBy('blog.published_at', 'DESC')
      .addOrderBy('blog.created_at', 'DESC');

    if (limit) {
      queryBuilder.take(limit);
    }

    const blogs = await queryBuilder.getMany();
    return blogs.map(blog => plainToClass(BlogResponseDto, blog, { excludeExtraneousValues: true }));
  }

  async findAllCategories(query: PaginationDto & { search?: string }) {
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.blogs', 'blog', 'blog.status = :status', { status: 'published' })
      .addSelect('COUNT(blog.id)', 'blogCount')
      .groupBy('category.id')
      .orderBy('category.name', 'ASC');

    if (query.search) {
      queryBuilder.andWhere('category.name ILIKE :search', { 
        search: `%${query.search}%` 
      });
    }

    // Apply pagination
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    const [categories, total] = await queryBuilder.getManyAndCount();

    return {
      data: categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async incrementViewCount(id: string) {
    await this.blogRepository.increment({ id }, 'view_count', 1);
    return { message: 'View count incremented successfully' };
  }

  private createBaseQuery(): SelectQueryBuilder<BlogEntity> {
    return this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.category', 'category')
      .leftJoinAndSelect('blog.author', 'author')
      .leftJoinAndSelect('blog.postBlocks', 'postBlocks')
      .leftJoinAndSelect('blog.translations', 'translations')
      .select([
        'blog.id',
        'blog.title',
        'blog.slug',
        'blog.excerpt',
        'blog.status',
        'blog.published_at',
        'blog.featured_image_url',
        'blog.featured_image_alt',
        'blog.meta_title',
        'blog.meta_description',
        'blog.og_image_url',
        'blog.social_media',
        'blog.is_featured',
        'blog.show_on_homepage',
        'blog.view_count',
        'blog.like_count',
        'blog.reading_time_minutes',
        'blog.field',
        'blog.created_at',
        'blog.updated_at',
        'category.id',
        'category.name',
        'translations.id',
        'translations.language_id',
        'translations.title',
        'translations.slug',
        'translations.excerpt',
        'postBlocks.id',
        'postBlocks.block_type',
        'postBlocks.content',
        'postBlocks.order',
        'postBlocks.is_featured',
        'postBlocks.metadata',
        'postBlocks.css_class',
        'postBlocks.style'
      ])
      .addOrderBy('postBlocks.order', 'ASC');
  }
}
