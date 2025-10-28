import { BaseEntity } from '../../config/database/entities/base.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity({ name: 'languages' })
export class LanguageEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 5, nullable: false, unique: true })
  @Index('language_code', { unique: true })
  code: string; // 'vi', 'en', 'zh'

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string; // 'Tiếng Việt', 'English', '中文'

  @Column({ type: 'varchar', length: 100, nullable: false })
  native_name: string; // 'Tiếng Việt', 'English', '中文'

  @Column({ type: 'varchar', length: 10, nullable: false })
  flag: string; // '🇻🇳', '🇺🇸', '🇨🇳'

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_default: boolean;

  @Column({ type: 'int', default: 0 })
  sort_order: number;
}
