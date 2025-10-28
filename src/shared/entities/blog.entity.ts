import { BaseEntity } from '../../config/database/entities/base.entity';
import { Column, Entity, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { AdminEntity } from './admin.entity';
import { PostBlockEntity } from './post-block.entity';
import { BlogTranslationEntity } from './blog-translation.entity';

@Entity({ name: 'blogs' })
export class BlogEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string;

  @Column({ type: 'char', length: 20, nullable: true })
  status: string;

  @Column({ type: 'date', nullable: true })
  published_at: Date;

  // Featured Image/Avatar fields
  @Column({ type: 'varchar', length: 500, nullable: true })
  featured_image_url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  featured_image_alt: string;

  // SEO fields
  @Column({ type: 'varchar', length: 160, nullable: true })
  meta_title: string;

  @Column({ type: 'varchar', length: 320, nullable: true })
  meta_description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  og_image_url: string;

  // Social media metadata
  @Column({ type: 'jsonb', nullable: true })
  social_media: any;

  // Homepage display fields
  @Column({ type: 'boolean', default: false })
  is_featured: boolean;

  @Column({ type: 'boolean', default: false })
  show_on_homepage: boolean;

  // Engagement metrics
  @Column({ type: 'integer', default: 0 })
  view_count: number;

  @Column({ type: 'integer', default: 0 })
  like_count: number;

  // Reading time estimation
  @Column({ type: 'integer', nullable: true })
  reading_time_minutes: number;

  @ManyToOne(() => CategoryEntity, (category) => category.blogs, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  category_id: string;

  // Category as text field for storing field/domain
  @Column({ type: 'varchar', length: 100, nullable: true })
  field: string;

  @ManyToOne(() => AdminEntity, (admin) => admin.blogs, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'author_id' })
  author: AdminEntity;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  author_id: string;

  @OneToMany(() => PostBlockEntity, (postBlock) => postBlock.post)
  postBlocks: PostBlockEntity[];

  @OneToMany(() => BlogTranslationEntity, (translation) => translation.blog)
  translations: BlogTranslationEntity[];
}
