import { BaseEntity } from '../../config/database/entities/base.entity';
import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { HumanResourceEntity } from './staff.entity';

@Entity({ name: 'certificates' })
export class CertificateEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  issuing_organization: string;

  @Column({ type: 'date', nullable: true })
  issue_date: Date;

  @Column({ type: 'date', nullable: true })
  expiration_date: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  credential_id: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  credential_url: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => HumanResourceEntity, (humanResource) => humanResource.certificates, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'human_resource_id' })
  humanResource: HumanResourceEntity;

  @Index()
  @Column({ type: 'uuid', nullable: false })
  human_resource_id: string;
}

