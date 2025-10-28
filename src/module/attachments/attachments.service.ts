import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttachmentsEntity } from '../../shared/entities/attachments.entity';
import { UploadService } from '../../shared/services/upload.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as path from 'path';

export interface UploadAttachmentDto {
  attachment_type?: string;
  is_public?: boolean;
}

export class AttachmentResponseDto {
  id: string;
  original_filename: string;
  stored_filename: string;
  file_url: string;
  mime_type: string;
  file_size: number;
  file_type: string;
  attachment_type?: string;
  is_public: boolean;
  created_at: Date;
}

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(AttachmentsEntity)
    private readonly attachmentsRepository: Repository<AttachmentsEntity>,
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Upload single file and create attachment record
   */
  async uploadFile(
    file: any,
    uploadDto: UploadAttachmentDto,
  ): Promise<AttachmentResponseDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Determine file type based on mime type
    const fileType = this.getFileType(file.mimetype);
    
    // Generate unique filename
    const fileExtension = path.extname(file.originalname || file.filename || '');
    const uniqueFilename = `${Date.now()}-${crypto.randomUUID()}${fileExtension}`;
    
    // Upload file using existing upload service
    let uploadedFile: any;
    
    switch (fileType) {
      case 'image':
        uploadedFile = await this.uploadService.uploadImage(file);
        break;
      case 'document':
        uploadedFile = await this.uploadService.uploadDocument(file);
        break;
      default:
        // For other types, use document upload as fallback
        uploadedFile = await this.uploadService.uploadDocument(file);
        break;
    }

    // Create attachment record
    const attachment = this.attachmentsRepository.create({
      original_filename: file.originalname || file.filename || uniqueFilename,
      stored_filename: uniqueFilename,
      file_path: uploadedFile.path,
      file_url: uploadedFile.url,
      mime_type: file.mimetype,
      file_size: file.size || uploadedFile.size,
      file_type: fileType,
      attachment_type: uploadDto.attachment_type || 'general',
      is_public: uploadDto.is_public ?? true,
    });

    const savedAttachment = await this.attachmentsRepository.save(attachment);
    return this.toResponseDto(savedAttachment);
  }

  /**
   * Upload multiple files with transaction support (all-or-nothing)
   */
  async uploadMultipleFiles(
    files: any[],
    uploadDto: UploadAttachmentDto,
  ): Promise<AttachmentResponseDto[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const results: AttachmentResponseDto[] = [];
    const uploadedFiles: { file: any; result: AttachmentResponseDto }[] = [];
    
    try {
      // Upload all files
      for (const file of files) {
        if (!file) {
          throw new BadRequestException('Invalid file provided');
        }
        
        const result = await this.uploadFile(file, uploadDto);
        results.push(result);
        uploadedFiles.push({ file, result });
      }

      return results;
    } catch (error) {
      // Rollback: Delete any successfully uploaded files
      console.error('❌ Multi-upload failed, rolling back uploaded files:', error);
      
      for (const { result } of uploadedFiles) {
        try {
          await this.deleteAttachment(result.id);
          console.log(`🗑️ Rolled back file: ${result.original_filename}`);
        } catch (rollbackError) {
          console.error(`❌ Failed to rollback file ${result.original_filename}:`, rollbackError);
        }
      }
      
      // Re-throw the original error
      throw error;
    }
  }

  /**
   * Upload multiple files with partial success allowed
   */
  async uploadMultipleFilesPartial(
    files: any[],
    uploadDto: UploadAttachmentDto,
  ): Promise<{
    successful: AttachmentResponseDto[];
    failed: { file: any; error: string }[];
  }> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const successful: AttachmentResponseDto[] = [];
    const failed: { file: any; error: string }[] = [];
    
    for (const file of files) {
      try {
        if (!file) {
          throw new BadRequestException('Invalid file provided');
        }
        
        const result = await this.uploadFile(file, uploadDto);
        successful.push(result);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        failed.push({ file, error: errorMessage });
        console.error(`Failed to upload file ${file.originalname}:`, error);
      }
    }

    return { successful, failed };
  }

  /**
   * Get all attachments
   */
  async getAllAttachments(): Promise<AttachmentResponseDto[]> {
    try {
      const attachments = await this.attachmentsRepository.find({
        order: { created_at: 'DESC' },
      });
      const result = attachments.map(attachment => this.toResponseDto(attachment));
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get attachments by file type (image, document, etc.)
   */
  async getAttachmentsByFileType(fileType: string): Promise<AttachmentResponseDto[]> {
    const attachments = await this.attachmentsRepository.find({
      where: { file_type: fileType as any },
      order: { created_at: 'DESC' },
    });
    return attachments.map(attachment => this.toResponseDto(attachment));
  }

  /**
   * Get all file types
   */
  async getAllFileTypes(): Promise<string[]> {
    const result = await this.attachmentsRepository
      .createQueryBuilder('attachment')
      .select('DISTINCT attachment.file_type', 'file_type')
      .getRawMany();
    
    return result.map(row => row.file_type);
  }

  /**
   * Get attachments by attachment type
   */
  async getAttachmentsByType(attachmentType: string): Promise<AttachmentResponseDto[]> {
    const attachments = await this.attachmentsRepository.find({
      where: { attachment_type: attachmentType },
      order: { created_at: 'ASC' },
    });
    return attachments.map(attachment => this.toResponseDto(attachment));
  }

  /**
   * Get single attachment by ID
   */
  async getAttachmentById(id: string): Promise<AttachmentResponseDto> {
    const attachment = await this.attachmentsRepository.findOne({
      where: { id },
    });

    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    return this.toResponseDto(attachment);
  }

  /**
   * Delete attachment
   */
  async deleteAttachment(id: string): Promise<void> {
    const attachment = await this.attachmentsRepository.findOne({
      where: { id },
    });

    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    // Delete physical file
    try {
      await this.uploadService.deleteFile(attachment.file_path);
    } catch (error) {
      console.error('Failed to delete physical file:', error);
      // Continue with database deletion
    }

    // Delete database record
    await this.attachmentsRepository.remove(attachment);
  }

  /**
   * Delete all attachments by attachment type
   */
  async deleteAttachmentsByType(attachmentType: string): Promise<void> {
    const attachments = await this.attachmentsRepository.find({
      where: {
        attachment_type: attachmentType,
      },
    });

    for (const attachment of attachments) {
      await this.deleteAttachment(attachment.id);
    }
  }

  /**
   * Get file statistics
   */
  async getFileStats(): Promise<{
    total_files: number;
    total_size: number;
    by_type: Record<string, { count: number; size: number }>;
  }> {
    const attachments = await this.attachmentsRepository.find();
    
    const stats = {
      total_files: attachments.length,
      total_size: 0,
      by_type: {} as Record<string, { count: number; size: number }>,
    };

    for (const attachment of attachments) {
      stats.total_size += attachment.file_size;
      
      if (!stats.by_type[attachment.file_type]) {
        stats.by_type[attachment.file_type] = { count: 0, size: 0 };
      }
      
      stats.by_type[attachment.file_type].count++;
      stats.by_type[attachment.file_type].size += attachment.file_size;
    }

    return stats;
  }

  /**
   * Clean up orphaned files (files without database records)
   */
  async cleanupOrphanedFiles(): Promise<{ deleted_count: number; deleted_size: number }> {
    // This would require filesystem scanning - implement as needed
    return { deleted_count: 0, deleted_size: 0 };
  }

  private getFileType(mimeType: string): 'image' | 'video' | 'document' | 'audio' | 'archive' | 'other' {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    
    if (mimeType.includes('pdf') || 
        mimeType.includes('document') || 
        mimeType.includes('text') ||
        mimeType.includes('spreadsheet') ||
        mimeType.includes('presentation')) {
      return 'document';
    }
    
    if (mimeType.includes('zip') || 
        mimeType.includes('rar') || 
        mimeType.includes('tar') ||
        mimeType.includes('7z')) {
      return 'archive';
    }
    
    return 'other';
  }

  /**
   * Test database connection
   */
  async getAttachmentCount(): Promise<number> {
    try {
      const count = await this.attachmentsRepository.count();
      console.log('📊 Database count result:', count);
      return count;
    } catch (error) {
      console.error('❌ Database count error:', error);
      throw error;
    }
  }

  private toResponseDto(attachment: AttachmentsEntity): AttachmentResponseDto {
    return {
      id: attachment.id,
      original_filename: attachment.original_filename,
      stored_filename: attachment.stored_filename,
      file_url: attachment.file_url,
      mime_type: attachment.mime_type,
      file_size: attachment.file_size,
      file_type: attachment.file_type,
      attachment_type: attachment.attachment_type,
      is_public: attachment.is_public,
      created_at: attachment.created_at || new Date(),
    };
  }
}