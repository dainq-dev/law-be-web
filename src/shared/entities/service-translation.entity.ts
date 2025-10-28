import { BaseEntity } from '../../config/database/entities/base.entity';
import { Column, Entity, ManyToOne, JoinColumn, Index, Unique } from 'typeorm';
import { ServiceEntity } from './service.entity';

@Entity({ name: 'service_translations' })
@Unique(['service_id'])
export class ServiceTranslationEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  short_description: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  features: string;

  @Column({ type: 'text', nullable: true })
  requirements: string;

  @ManyToOne(() => ServiceEntity, (service) => service.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'service_id' })
  service: ServiceEntity;

  @Index()
  @Column({ type: 'uuid', nullable: false })
  service_id: string;

  @Index()
  @Column({ type: 'varchar', length: 5, nullable: false })
  language_code: string;
}
