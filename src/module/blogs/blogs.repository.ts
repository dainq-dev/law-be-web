import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogEntity, PostBlockEntity } from '@shared/entities';
import { PaginationOptions } from '@shared/utilities/pagination';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
    @InjectRepository(PostBlockEntity)
    private readonly postBlockRepository: Repository<PostBlockEntity>,
  ) {}

  // Blog methods
  async create(blogData: Partial<BlogEntity>): Promise<BlogEntity> {
    const blog = this.blogRepository.create(blogData);
    return this.blogRepository.save(blog);
  }

  async findById(id: string): Promise<BlogEntity | null> {
    return this.blogRepository.findOne({
      where: { id },
      relations: ['postBlocks'],
    });
  }

  async findBySlug(slug: string): Promise<BlogEntity | null> {
    return this.blogRepository.findOne({
      where: { slug },
      relations: ['postBlocks'],
    });
  }

  async findAll(
    options: PaginationOptions & { search?: string; is_featured?: boolean },
  ): Promise<{
    data: BlogEntity[];
    total: number;
  }> {
    const page = options.page || 1;
    const limit = options.limit || 10;

    const queryBuilder = this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.postBlocks', 'postBlocks')
      .orderBy('blog.created_at', 'DESC');

    if (options.search) {
      queryBuilder.andWhere(
        '(blog.title_vi ILIKE :search OR blog.title_en ILIKE :search OR blog.title_zh ILIKE :search OR blog.excerpt_vi ILIKE :search OR blog.excerpt_en ILIKE :search OR blog.excerpt_zh ILIKE :search OR blog.description_vi ILIKE :search OR blog.description_en ILIKE :search OR blog.description_zh ILIKE :search)',
        { search: `%${options.search}%` },
      );
    }

    if (options.is_featured !== undefined) {
      queryBuilder.andWhere('blog.is_featured = :is_featured', {
        is_featured: options.is_featured,
      });
    }

    queryBuilder
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  async update(id: string, blogData: Partial<BlogEntity>): Promise<BlogEntity | null> {
    await this.blogRepository.update(id, blogData);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.blogRepository.softDelete(id);
  }

  // Category methods removed - CategoryEntity doesn't exist

  // Post Block methods
  async createPostBlock(postBlockData: Partial<PostBlockEntity>): Promise<PostBlockEntity> {
    const postBlock = this.postBlockRepository.create(postBlockData);
    return this.postBlockRepository.save(postBlock);
  }

  async updatePostBlock(
    id: string,
    postBlockData: Partial<PostBlockEntity>,
  ): Promise<PostBlockEntity | null> {
    await this.postBlockRepository.update(id, postBlockData);
    return this.postBlockRepository.findOne({ where: { id } });
  }

  async deletePostBlock(id: string): Promise<void> {
    await this.postBlockRepository.delete(id);
  }

  // Featured blogs methods
  async findFeaturedBlogs(limit: number = 5): Promise<BlogEntity[]> {
    return this.blogRepository.find({
      where: { is_featured: true },
      relations: ['postBlocks'],
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  // Update like count
  async incrementLikeCount(id: string): Promise<void> {
    await this.blogRepository.increment({ id }, 'like_count', 1);
  }

  async decrementLikeCount(id: string): Promise<void> {
    await this.blogRepository.decrement({ id }, 'like_count', 1);
  }
}

