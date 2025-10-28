import { BaseEntity } from '../../config/database/entities/base.entity';
import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BlogEntity } from './blog.entity';

@Entity({ name: 'post_blocks' })
export class PostBlockEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 50, nullable: true })
  block_type: string; // 'text', 'heading', 'image', 'quote', 'list', 'video', 'code', 'divider'

  @Column({ type: 'jsonb', nullable: true })
  content: any;

  @Column({ type: 'integer', nullable: true })
  order: number;

  @Column({ type: 'boolean', default: false })
  is_featured: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any; // SEO, styling, custom attributes

  @Column({ type: 'varchar', length: 100, nullable: true })
  css_class: string; // Custom CSS classes for styling

  @Column({ type: 'jsonb', nullable: true })
  style: any; // Inline styles and formatting

  @ManyToOne(() => BlogEntity, (blog) => blog.postBlocks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: BlogEntity;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  post_id: string;
}
