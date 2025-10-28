import { BaseEntity } from '../../config/database/entities/base.entity';
import { Column, Entity, OneToMany, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ProcessStepEntity } from './process-step.entity';
import { ServiceTranslationEntity } from './service-translation.entity';

@Entity({ name: 'services' })
export class ServiceEntity extends BaseEntity {
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

  @Column({ type: 'varchar', length: 500, nullable: true })
  image_url: string;

  @Column({ type: 'int', default: 0 })
  sort_order: number;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_featured: boolean;

  @Column({ type: 'text', nullable: true })
  legal_fields: string; // JSON string chứa các lĩnh vực pháp lý như "Bào chữa bị can, bị cáo", "Bảo vệ nạn nhân"

  @OneToMany(() => ProcessStepEntity, (processStep) => processStep.service)
  processSteps: ProcessStepEntity[];

  @OneToMany(() => ServiceTranslationEntity, (translation) => translation.service)
  translations: ServiceTranslationEntity[];
}

// Export the translation entity
export { ServiceTranslationEntity } from './service-translation.entity';
