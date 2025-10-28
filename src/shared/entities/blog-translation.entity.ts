import { BaseEntity } from '../../config/database/entities/base.entity';
import { Column, Entity, ManyToOne, JoinColumn, Index, Unique } from 'typeorm';
import { BlogEntity } from './blog.entity';
import { LanguageEntity } from './language.entity';

@Entity({ name: 'blog_translations' })
@Unique(['blog_id', 'language_id'])
export class BlogTranslationEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string;

  @ManyToOne(() => BlogEntity, (blog) => blog.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'blog_id' })
  blog: BlogEntity;

  @Index()
  @Column({ type: 'uuid', nullable: false })
  blog_id: string;

  @ManyToOne(() => LanguageEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'language_id' })
  language: LanguageEntity;

  @Index()
  @Column({ type: 'uuid', nullable: false })
  language_id: string;
}
