import { BaseEntity } from '../../config/database/entities/base.entity';
import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ServiceEntity } from './service.entity';

@Entity({ name: 'process_steps' })
export class ProcessStepEntity extends BaseEntity {
  @Column({ type: 'integer', nullable: true })
  step_number: number;

  @Column({ type: 'text', nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => ServiceEntity, (service) => service.processSteps, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'service_id' })
  service: ServiceEntity;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  service_id: string;
}
