import { BaseEntity } from '../../config/database/entities/base.entity';
import { Column, Entity, OneToMany, ManyToOne, JoinColumn, Index } from 'typeorm';
import { EducationEntity } from './education.entity';
import { ExperienceEntity } from './experience.entity';
import { CertificateEntity } from './certificate.entity';
import { HumanResourceTranslationEntity } from './staff-translation.entity';

@Entity({ name: 'human_resources' })
export class HumanResourceEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  first_name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  last_name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  full_name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  position: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Index('hr_email', { unique: false })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number: string;

  @Column({ type: 'text', nullable: true })
  about: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar_url: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;

  @Column({ type: 'varchar', length: 10, nullable: true })
  gender: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  company_name: string;

  @Column({ type: 'int', default: 0 })
  sort_order: number;

  @Column({ type: 'boolean', default: false })
  is_featured: boolean;

  @OneToMany(() => EducationEntity, (education) => education.humanResource)
  educations: EducationEntity[];

  @OneToMany(() => ExperienceEntity, (experience) => experience.humanResource)
  experiences: ExperienceEntity[];

  @OneToMany(() => CertificateEntity, (certificate) => certificate.humanResource)
  certificates: CertificateEntity[];

  @OneToMany(() => HumanResourceTranslationEntity, (translation) => translation.humanResource)
  translations: HumanResourceTranslationEntity[];
}

// Export the translation entity
export { HumanResourceTranslationEntity } from './staff-translation.entity';
