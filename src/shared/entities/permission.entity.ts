import { BaseEntity } from '../../config/database/entities/base.entity';
import { Entity, Column, Index } from 'typeorm';

@Entity('permissions')
export class PermissionEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Index()
  @Column({ type: 'text' })
  permission_id: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
