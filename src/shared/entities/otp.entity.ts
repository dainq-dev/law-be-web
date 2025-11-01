import { BaseEntity } from '../../config/database/entities/base.entity';
import { Entity, Column, Index, Unique } from 'typeorm';

@Entity({ name: 'otps' })
@Index(['identifier', 'created_at'])
@Index(['expires_at'])
@Unique(['identifier', 'is_used']) // Đảm bảo chỉ có 1 OTP chưa sử dụng cho mỗi identifier
export class OtpEntity extends BaseEntity {
  @Column({
    name: 'identifier',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Identifier để identify OTP (vd: block-website, user_id, etc.)',
  })
  identifier: string;

  @Column({
    name: 'otp_code',
    type: 'varchar',
    length: 10,
    nullable: false,
    comment: 'Mã OTP',
  })
  otp_code: string;

  @Column({
    name: 'expires_at',
    type: 'timestamptz',
    nullable: false,
    comment: 'Thời gian hết hạn OTP',
  })
  expires_at: Date;

  @Column({
    name: 'is_used',
    type: 'boolean',
    default: false,
    comment: 'OTP đã được sử dụng chưa',
  })
  is_used: boolean;

  @Column({
    name: 'used_at',
    type: 'timestamptz',
    nullable: true,
    comment: 'Thời gian sử dụng OTP',
  })
  used_at?: Date;
}

