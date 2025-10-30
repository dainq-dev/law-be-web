import { BaseEntity } from '../../config/database/entities/base.entity';
import { Column, Entity, ManyToOne, JoinColumn, Index, OneToMany } from 'typeorm';
import { HumanResourceEntity } from './staff.entity';

@Entity({ name: 'education' })
export class EducationEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  university_vi: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  university_en: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  university_zh: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  degree_vi: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  degree_en: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  degree_zh: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  field_of_study_vi: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  field_of_study_en: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  field_of_study_zh: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description_vi: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  description_en: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  description_zh: string;

  @Column({ type: 'date', nullable: true })
  from: Date;

  @Column({ type: 'date', nullable: true })
  to: Date;

  @ManyToOne(() => HumanResourceEntity, (hr) => hr.educations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'staff_id' })
  staff: HumanResourceEntity;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  staff_id: string;
}
