import { BaseEntity } from '../../config/database/entities/base.entity';
import { Column, Entity, ManyToOne, JoinColumn, Index, OneToMany } from 'typeorm';

@Entity({ name: 'attachments' })
@Index(['file_type'])
@Index(['created_at'])
export class AttachmentsEntity extends BaseEntity {
  @Column({ 
    name: 'original_filename', 
    type: 'varchar', 
    length: 255,
    nullable: false 
  })
  original_filename: string;

  @Column({ 
    name: 'stored_filename', 
    type: 'varchar', 
    length: 255,
    nullable: false,
    unique: true 
  })
  stored_filename: string;

  @Column({ 
    name: 'file_path', 
    type: 'varchar', 
    length: 500,
    nullable: false 
  })
  file_path: string;

  @Column({ 
    name: 'file_url', 
    type: 'varchar', 
    length: 500,
    nullable: false 
  })
  file_url: string;

  @Column({ 
    name: 'mime_type', 
    type: 'varchar', 
    length: 100,
    nullable: false 
  })
  mime_type: string;

  @Column({ 
    name: 'file_size', 
    type: 'bigint',
    nullable: false 
  })
  file_size: number;

  @Column({ 
    name: 'file_type', 
    type: 'enum',
    enum: ['image', 'video', 'document', 'audio', 'archive', 'other'],
    nullable: false 
  })
  file_type: 'image' | 'video' | 'document' | 'audio' | 'archive' | 'other';

  @Column({ 
    name: 'attachment_type', 
    type: 'varchar', 
    length: 50,
    nullable: true,
    comment: 'Specific type of attachment (avatar, thumbnail, document, etc.)'
  })
  attachment_type: string;

  @Column({ 
    name: 'is_public', 
    type: 'boolean',
    default: true,
    nullable: false 
  })
  is_public: boolean;
}
