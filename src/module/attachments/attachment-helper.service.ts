import { Injectable } from '@nestjs/common';
import { AttachmentsService, UploadAttachmentDto } from './attachments.service';

@Injectable()
export class AttachmentHelperService {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  /**
   * Upload files with specific attachment type
   */
  async uploadFiles(
    files: any[],
    attachmentType: string = 'general',
    isPublic: boolean = true,
  ) {
    const uploadDto: UploadAttachmentDto = {
      attachment_type: attachmentType,
      is_public: isPublic,
    };

    return this.attachmentsService.uploadMultipleFiles(files, uploadDto);
  }

  /**
   * Get files by attachment type
   */
  async getFilesByType(attachmentType: string) {
    return this.attachmentsService.getAttachmentsByType(attachmentType);
  }

  /**
   * Delete all files by attachment type
   */
  async deleteFilesByType(attachmentType: string) {
    return this.attachmentsService.deleteAttachmentsByType(attachmentType);
  }

  /**
   * Upload avatar files
   */
  async uploadAvatars(files: any[]) {
    return this.uploadFiles(files, 'avatar');
  }

  /**
   * Upload image files
   */
  async uploadImages(files: any[]) {
    return this.uploadFiles(files, 'image');
  }

  /**
   * Upload document files
   */
  async uploadDocuments(files: any[]) {
    return this.uploadFiles(files, 'document');
  }

  /**
   * Upload general files
   */
  async uploadGeneralFiles(files: any[]) {
    return this.uploadFiles(files, 'general');
  }
}
