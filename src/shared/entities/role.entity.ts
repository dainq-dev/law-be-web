import { BaseEntity } from '../../config/database/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { AdminEntity } from './admin.entity';

@Entity({ name: 'roles' })
export class RoleEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  permissions: string;

  @OneToMany(() => AdminEntity, (admin) => admin.role)
  admins: AdminEntity[];
}
