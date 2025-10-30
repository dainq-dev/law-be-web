import { BaseEntity } from '../../config/database/entities/base.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity({ name: 'contacts' })
export class ContactEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  full_name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Index('contact_email')
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subject: string;

  @Column({ type: 'text', nullable: false })
  message: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  company: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip_address: string;

  @Column({ type: 'text', nullable: true })
  user_agent: string;

  @Column({ type: 'timestamptz', nullable: true })
  responded_at: Date;
}

