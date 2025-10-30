import { BaseEntity } from '../../config/database/entities/base.entity';
import { Column, Entity, OneToMany, ManyToOne, JoinColumn, Index } from 'typeorm';
import { EducationEntity } from './education.entity';
import { ExperienceEntity } from './experience.entity';
import { CertificateEntity } from './certificate.entity';

@Entity({ name: 'human_resources' })
export class HumanResourceEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  full_name_vi: string; // TODO: After running migration script, set to nullable: false
  @Column({ type: 'varchar', length: 255, nullable: true })
  full_name_en: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  full_name_zh: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  position_vi: string; // TODO: After running migration script, set to nullable: false
  @Column({ type: 'varchar', length: 255, nullable: true })
  position_en: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  position_zh: string;

  @Column({ type: 'text', nullable: true })
  about_vi: string;
  @Column({ type: 'text', nullable: true })
  about_en: string;
  @Column({ type: 'text', nullable: true })
  about_zh: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location_vi: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  location_en: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  location_zh: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address_vi: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  address_en: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  address_zh: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Index('hr_email', { unique: false })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar_url: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;

  @Column({ type: 'varchar', length: 10, nullable: true })
  gender: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_featured: boolean;

  @OneToMany(() => EducationEntity, (education) => education.staff)
  educations: EducationEntity[];

  @OneToMany(() => ExperienceEntity, (experience) => experience.staff)
  experiences: ExperienceEntity[];

  @OneToMany(() => CertificateEntity, (certificate) => certificate.staff)
  certificates: CertificateEntity[];
}
