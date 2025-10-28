import { BaseEntity } from '../../config/database/entities/base.entity';
import { Entity, Column, Index } from 'typeorm';

@Entity({ name: 'web_configs' })
@Index(['key', 'screen'], { unique: true })
export class WebConfigEntity extends BaseEntity {
  @Column({
    name: 'config_key',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Key của config (vd: company_name, slogan, primary_color)',
  })
  key: string;

  @Column({
    name: 'config_value',
    type: 'text',
    nullable: true,
    comment: 'Giá trị của config',
  })
  value: string;

  @Column({
    name: 'screen',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Tên màn hình áp dụng config',
  })
  screen: string;
}