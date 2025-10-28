import { BaseEntity } from '../../config/database/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { BlogEntity } from './blog.entity';
import { CategoryTranslationEntity } from './category-translation.entity';

@Entity({ name: 'categories' })
export class CategoryEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @OneToMany(() => BlogEntity, (blog) => blog.category)
  blogs: BlogEntity[];

  @OneToMany(() => CategoryTranslationEntity, (translation) => translation.category)
  translations: CategoryTranslationEntity[];
}