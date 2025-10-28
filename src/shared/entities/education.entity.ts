import { BaseEntity } from '../../config/database/entities/base.entity';
import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { HumanResourceEntity } from './staff.entity';

@Entity({ name: 'education' })
export class EducationEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  university: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  degree: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  field_of_study: string;

  @Column({ type: 'date', nullable: true })
  from: Date;

  @Column({ type: 'date', nullable: true })
  to: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @ManyToOne(() => HumanResourceEntity, (hr) => hr.educations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'hr_id' })
  humanResource: HumanResourceEntity;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  hr_id: string;
}
