import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { BlogEntity } from '@shared/entities';
import { BlogResponseDto } from '../../blogs/dto/blog-response.dto';
import { PaginationDto } from '@shared/dto/pagination.dto';

@Injectable()
export class PublicBlogsRepository {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
  ) {}

  async findAll(query: PaginationDto & { 
    search?: string; 
    is_featured?: boolean; 
    status?: string;
  }) {
    const queryBuilder = this.createBaseQuery();
    
    if (query.search) {
      queryBuilder.andWhere(
        '(blog.title_vi ILIKE :search OR blog.title_en ILIKE :search OR blog.title_zh ILIKE :search OR blog.excerpt_vi ILIKE :search OR blog.excerpt_en ILIKE :search OR blog.excerpt_zh ILIKE :search OR blog.description_vi ILIKE :search OR blog.description_en ILIKE :search OR blog.description_zh ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    if (query.is_featured !== undefined) {
      queryBuilder.andWhere('blog.is_featured = :is_featured', { 
        is_featured: query.is_featured 
      });
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

  async findBySlug(slug: string): Promise<any> {
    const queryBuilder = this.createBaseQuery();
    queryBuilder
    .where('blog.slug = :slug', { slug });

    const blog = await queryBuilder.getOne();
    console.log("🚀 ~ PublicBlogsRepository ~ findBySlug ~ blog:", JSON.stringify(blog, null, 2))
    return blog;
  }

  async getFeaturedBlogs(limit?: number) {
    const queryBuilder = this.createBaseQuery();
    
    queryBuilder
      .where('blog.is_featured = :is_featured', { is_featured: true })
      .orderBy('blog.published_at', 'DESC')
      .addOrderBy('blog.created_at', 'DESC');

    if (limit) {
      queryBuilder.take(limit);
    }

    const blogs = await queryBuilder.getMany();
    return blogs.map(blog => plainToClass(BlogResponseDto, blog, { excludeExtraneousValues: true }));
  }

  private createBaseQuery(): SelectQueryBuilder<BlogEntity> {
    return this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.postBlocks', 'postBlocks')
      .select([
        'blog.id',
        'blog.title_vi',
        'blog.title_en',
        'blog.title_zh',
        'blog.slug',
        'blog.excerpt_vi',
        'blog.excerpt_en',
        'blog.excerpt_zh',
        'blog.description_vi',
        'blog.description_en',
        'blog.description_zh',
        'blog.status',
        'blog.published_at',
        'blog.featured_image_url',
        'blog.featured_image_alt',
        'blog.is_featured',
        'blog.like_count',
        'blog.created_at',
        'blog.updated_at',
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
