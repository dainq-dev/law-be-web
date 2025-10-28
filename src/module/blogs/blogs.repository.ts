import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogEntity, CategoryEntity, PostBlockEntity } from '@shared/entities';
import { PaginationOptions } from '@shared/utilities/pagination';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
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
      relations: ['category', 'author', 'postBlocks'],
    });
  }

  async findAll(
    options: PaginationOptions & { search?: string; category_id?: string; is_featured?: boolean; show_on_homepage?: boolean },
  ): Promise<{
    data: BlogEntity[];
    total: number;
  }> {
    const page = options.page || 1;
    const limit = options.limit || 10;

    const queryBuilder = this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.category', 'category')
      .leftJoinAndSelect('blog.author', 'author')
      .leftJoinAndSelect('blog.postBlocks', 'postBlocks')
      .orderBy('blog.created_at', 'DESC');

    if (options.search) {
      queryBuilder.andWhere(
        '(blog.title ILIKE :search OR blog.excerpt ILIKE :search OR blog.meta_title ILIKE :search OR blog.meta_description ILIKE :search)',
        { search: `%${options.search}%` },
      );
    }

    if (options.category_id) {
      queryBuilder.andWhere('blog.category_id = :category_id', {
        category_id: options.category_id,
      });
    }

    if (options.is_featured !== undefined) {
      queryBuilder.andWhere('blog.is_featured = :is_featured', {
        is_featured: options.is_featured,
      });
    }

    if (options.show_on_homepage !== undefined) {
      queryBuilder.andWhere('blog.show_on_homepage = :show_on_homepage', {
        show_on_homepage: options.show_on_homepage,
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

  // Category methods
  async createCategory(categoryData: Partial<CategoryEntity>): Promise<CategoryEntity> {
    const category = this.categoryRepository.create(categoryData);
    return this.categoryRepository.save(category);
  }

  async findCategoryById(id: string): Promise<CategoryEntity | null> {
    return this.categoryRepository.findOne({
      where: { id },
      relations: ['blogs'],
    });
  }

  async findCategoryByName(name: string): Promise<CategoryEntity | null> {
    return this.categoryRepository.findOne({
      where: { name },
      relations: ['blogs'],
    });
  }

  async findAllCategories(
    options: PaginationOptions & { search?: string },
  ): Promise<{
    data: CategoryEntity[];
    total: number;
  }> {
    const page = options.page || 1;
    const limit = options.limit || 10;

    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .orderBy('category.created_at', 'ASC');

    if (options.search) {
      queryBuilder.andWhere('category.name ILIKE :search', {
        search: `%${options.search}%`,
      });
    }

    queryBuilder
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  async updateCategory(
    id: string,
    categoryData: Partial<CategoryEntity>,
  ): Promise<CategoryEntity | null> {
    await this.categoryRepository.update(id, categoryData);
    return this.findCategoryById(id);
  }

  async deleteCategory(id: string): Promise<void> {
    await this.categoryRepository.softDelete(id);
  }

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
      where: { is_featured: true, status: 'published' },
      relations: ['category', 'author', 'postBlocks'],
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  async findHomepageBlogs(limit: number = 10): Promise<BlogEntity[]> {
    return this.blogRepository.find({
      where: { show_on_homepage: true, status: 'published' },
      relations: ['category', 'author', 'postBlocks'],
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  // Update view count
  async incrementViewCount(id: string): Promise<void> {
    await this.blogRepository.increment({ id }, 'view_count', 1);
  }

  // Update like count
  async incrementLikeCount(id: string): Promise<void> {
    await this.blogRepository.increment({ id }, 'like_count', 1);
  }

  async decrementLikeCount(id: string): Promise<void> {
    await this.blogRepository.decrement({ id }, 'like_count', 1);
  }
}

