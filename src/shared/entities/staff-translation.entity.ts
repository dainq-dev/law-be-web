import { BaseEntity } from '../../config/database/entities/base.entity';
import { Column, Entity, ManyToOne, JoinColumn, Index, Unique } from 'typeorm';
import { HumanResourceEntity } from './staff.entity';
import { LanguageEntity } from './language.entity';

@Entity({ name: 'human_resource_translations' })
@Unique(['human_resource_id', 'language_id'])
export class HumanResourceTranslationEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  first_name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  last_name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  full_name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  position: string;

  @Column({ type: 'text', nullable: true })
  about: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  department: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @ManyToOne(() => HumanResourceEntity, (hr) => hr.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'human_resource_id' })
  humanResource: HumanResourceEntity;

  @Index()
  @Column({ type: 'uuid', nullable: false })
  human_resource_id: string;

  @ManyToOne(() => LanguageEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'language_id' })
  language: LanguageEntity;

  @Index()
  @Column({ type: 'uuid', nullable: false })
  language_id: string;
}
