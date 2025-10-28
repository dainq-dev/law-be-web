import { BaseEntity } from '../../config/database/entities/base.entity';
import { JsonToken } from '../interface/token.interface';
import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { BlogEntity } from './blog.entity';

@Entity({ name: 'admins' })
export class AdminEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  @Index('user_email', { unique: false })
  user_email: string;

  @Column({ type: 'varchar', nullable: false })
  @Exclude()
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  full_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone_number: string;

  @ManyToOne(() => RoleEntity, (role) => role.admins, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  role_id: string;

  @Column({ type: 'jsonb', nullable: false, default: '[]' })
  json_token: JsonToken[];

  @Column('text', { array: true, nullable: true, default: '{}' })
  json_permission: string[];

  @Column({ type: 'timestamptz', nullable: true })
  last_login_date?: Date;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  password_last_update?: Date;

  @Column({ default: 3600, type: 'int' })
  public expiresIn: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  refresh_token?: string;

  @Column({ type: 'timestamptz', nullable: true })
  refresh_token_expires?: Date;

  @Column({ type: 'varchar', length: 6, nullable: true })
  reset_password_code?: string;

  @Column({ type: 'timestamptz', nullable: true })
  reset_password_expires?: Date;

  @Column({ type: 'int', default: 0 })
  login_attempts: number;

  @Column({ type: 'timestamptz', nullable: true })
  locked_until?: Date;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_root: boolean;

  @Column({ type: 'boolean', default: false })
  is_first_account: boolean;

  @OneToMany(() => BlogEntity, (blog) => blog.author)
  blogs: BlogEntity[];
}
