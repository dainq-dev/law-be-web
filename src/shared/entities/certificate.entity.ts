import { BaseEntity } from '../../config/database/entities/base.entity';
import { Column, Entity, ManyToOne, JoinColumn, Index, OneToMany } from 'typeorm';
import { HumanResourceEntity } from './staff.entity';

@Entity({ name: 'certificates' })
export class CertificateEntity extends BaseEntity {
  // Vietnamese (main language - kept for backward compatibility)
  @Column({ type: 'varchar', length: 255, nullable: false })
  name_vi: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  name_en: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  name_zh: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  issuing_organization_vi: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  issuing_organization_en: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  issuing_organization_zh: string;

  @Column({ type: 'text', nullable: true })
  description_vi: string;
  @Column({ type: 'text', nullable: true })
  description_en: string;
  @Column({ type: 'text', nullable: true })
  description_zh: string;

  @Column({ type: 'date', nullable: true })
  issue_date: Date;

  @Column({ type: 'date', nullable: true })
  expiration_date: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  credential_id: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  credential_url: string;

  @ManyToOne(() => HumanResourceEntity, (humanResource) => humanResource.certificates, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'staff_id' })
  staff: HumanResourceEntity;

  @Index()
  @Column({ type: 'uuid', nullable: false })
  staff_id: string;
}

