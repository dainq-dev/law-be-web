import { BaseEntity } from '../../config/database/entities/base.entity';
import { Column, Entity} from 'typeorm';

@Entity({ name: 'services' })
export class ServiceEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  name_vi: string; // TODO: After running migration script, set to nullable: false
  @Column({ type: 'varchar', length: 255, nullable: true })
  name_en: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  name_zh: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  short_description_vi: string;
  @Column({ type: 'varchar', length: 500, nullable: true })
  short_description_en: string;
  @Column({ type: 'varchar', length: 500, nullable: true })
  short_description_zh: string;

  @Column({ type: 'text', nullable: true })
  description_vi: string;
  @Column({ type: 'text', nullable: true })
  description_en: string;
  @Column({ type: 'text', nullable: true })
  description_zh: string;

  @Column({ type: 'text', nullable: true })
  legal_fields_vi: string;
  @Column({ type: 'text', nullable: true })
  legal_fields_en: string;
  @Column({ type: 'text', nullable: true })
  legal_fields_zh: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image_url: string;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_featured: boolean;
}
