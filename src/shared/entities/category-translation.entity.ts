import { BaseEntity } from '../../config/database/entities/base.entity';
import { Column, Entity, ManyToOne, JoinColumn, Index, Unique } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { LanguageEntity } from './language.entity';

@Entity({ name: 'category_translations' })
@Unique(['category_id', 'language_id'])
export class CategoryTranslationEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @ManyToOne(() => CategoryEntity, (category) => category.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @Index()
  @Column({ type: 'uuid', nullable: false })
  category_id: string;

  @ManyToOne(() => LanguageEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'language_id' })
  language: LanguageEntity;

  @Index()
  @Column({ type: 'uuid', nullable: false })
  language_id: string;
}
