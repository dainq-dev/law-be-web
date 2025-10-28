import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
  Column,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at?: Date;

  @VersionColumn({ default: 0 })
  @Exclude()
  __v?: number;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: false,
  })
  is_active: boolean;
}
