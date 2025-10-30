import { BaseEntity } from '../../config/database/entities/base.entity';
import { Column, Entity, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { PostBlockEntity } from './post-block.entity';

@Entity({ name: 'blogs' })
export class BlogEntity extends BaseEntity {
  // Tiêu đề
  @Column({ type: 'varchar', length: 255, nullable: true })
  title_vi: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  title_en: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  title_zh: string;

  // Slug
  @Column({ type: 'varchar', length: 255, nullable: true })
  slug: string;

  // Lĩnh vực
  @Column({ type: 'text', nullable: true })
  excerpt_vi: string;
  @Column({ type: 'text', nullable: true })
  excerpt_en: string;
  @Column({ type: 'text', nullable: true })
  excerpt_zh: string;

  // Mô tả
  @Column({ type: 'text', nullable: true })
  description_vi: string;
  @Column({ type: 'text', nullable: true })
  description_en: string;
  @Column({ type: 'text', nullable: true })
  description_zh: string;
  
  // Trạng thái
  @Column({ type: 'char', length: 20, nullable: true })
  status: string;

  // Ngày xuất bản
  @Column({ type: 'date', nullable: true })
  published_at: Date;

  // Ảnh đại diện
  @Column({ type: 'varchar', length: 500, nullable: true })
  featured_image_url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  featured_image_alt: string;

  // Hiển thị trên trang chủ
  @Column({ type: 'boolean', default: false })
  is_featured: boolean;

   // Hiển thị trên trang chủ
  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @Column({ type: 'integer', default: 0 })
  like_count: number;

  // Blocks Nội dung
  @OneToMany(() => PostBlockEntity, (postBlock) => postBlock.post)
  postBlocks: PostBlockEntity[];
}
