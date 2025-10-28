import { BaseEntity } from '../../config/database/entities/base.entity';
import { Column, Entity, ManyToOne, JoinColumn, Index, OneToMany } from 'typeorm';
import { HumanResourceEntity } from './staff.entity';

@Entity({ name: 'experience' })
export class ExperienceEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  company: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  position: string;

  @Column({ type: 'date', nullable: true })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => HumanResourceEntity, (hr) => hr.experiences, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'hr_id' })
  humanResource: HumanResourceEntity;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  hr_id: string;
}
