import { BaseEntity } from '../../config/database/entities/base.entity';
import { Column, Entity, ManyToOne, JoinColumn, Index, OneToMany } from 'typeorm';
import { HumanResourceEntity } from './staff.entity';

@Entity({ name: 'experience' })
export class ExperienceEntity extends BaseEntity {
  // Vietnamese (main language - kept for backward compatibility)
  @Column({ type: 'varchar', length: 255, nullable: true })
  company_vi: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  company_en: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  company_zh: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  position_vi: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  position_en: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  position_zh: string;

  @Column({ type: 'text', nullable: true })
  description_vi: string;
  @Column({ type: 'text', nullable: true })
  description_en: string;
  @Column({ type: 'text', nullable: true })
  description_zh: string;

  @Column({ type: 'date', nullable: true })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @ManyToOne(() => HumanResourceEntity, (hr) => hr.experiences, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'staff_id' })
  staff: HumanResourceEntity;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  staff_id: string;
}
