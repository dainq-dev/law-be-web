import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { pipeline } from 'stream';
import * as crypto from 'crypto';

const pump = promisify(pipeline);

export interface UploadedFile {
  filename: string;
  originalFilename: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
}

@Injectable()
export class UploadService {
  private readonly uploadDir: string;
  private readonly uploadRoot: string;
  private readonly maxFileSize: number;
  private readonly allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  private readonly allowedDocumentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  constructor(private readonly configService: ConfigService) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR') || './uploads';
    this.uploadRoot = path.resolve(process.cwd(), this.uploadDir);
    this.maxFileSize = parseInt(this.configService.get<string>('MAX_FILE_SIZE') || '10485760', 10); // 10MB default

    // Create upload directory if it doesn't exist
    this.ensureUploadDir();
  }

  private ensureUploadDir(): void {
    const dirs = ['avatars', 'images', 'documents'];
    
    if (!fs.existsSync(this.uploadRoot)) {
      fs.mkdirSync(this.uploadRoot, { recursive: true });
    }

    dirs.forEach(dir => {
      const fullPath = path.join(this.uploadRoot, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    });
  }

  async uploadAvatar(file: any): Promise<UploadedFile> {
    return this.uploadFile(file, 'avatars', this.allowedImageTypes);
  }

  async uploadImage(file: any): Promise<UploadedFile> {
    return this.uploadFile(file, 'images', this.allowedImageTypes);
  }

  async uploadDocument(file: any): Promise<UploadedFile> {
    return this.uploadFile(file, 'documents', [...this.allowedImageTypes, ...this.allowedDocumentTypes]);
  }

  private async uploadFile(
    file: any,
    subDir: string,
    allowedTypes: string[],
  ): Promise<UploadedFile> {
    console.log('UploadService.uploadFile - Received file:', {
      file: file,
      mimetype: file?.mimetype,
      type: file?.type,
      filename: file?.filename,
      name: file?.name,
      size: file?.size
    });

    // Validate file
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const mimetype = file.mimetype || file.type;
    console.log('UploadService - Checking mimetype:', {
      mimetype,
      allowedTypes,
      isValid: allowedTypes.includes(mimetype)
    });

    if (!allowedTypes.includes(mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
      );
    }

    // Generate unique filename
    const fileExt = path.extname(file.originalname || file.filename || file.name || '');
    const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${fileExt}`;
    const uploadPath = path.join(this.uploadRoot, subDir, filename);

    try {
      // For Express.Multer.File
      if (file.buffer) {
        await fs.promises.writeFile(uploadPath, file.buffer);
      }
      // For Fastify multipart stream
      else if (file.file) {
        await pump(file.file, fs.createWriteStream(uploadPath));
      }
      // For Fastify multipart stream (new format)
      else if (file.toBuffer) {
        const buffer = await file.toBuffer();
        await fs.promises.writeFile(uploadPath, buffer);
      }
      else {
        console.error('Invalid file format:', file);
        throw new BadRequestException('Invalid file format');
      }

      // Get file stats
      const stats = await fs.promises.stat(uploadPath);
      
      if (stats.size > this.maxFileSize) {
        // Delete uploaded file
        await fs.promises.unlink(uploadPath);
        throw new BadRequestException(
          `File too large. Maximum size: ${this.maxFileSize / 1024 / 1024}MB`,
        );
      }

      return {
        filename,
        originalFilename: file.originalname || file.filename || file.name || filename,
        mimetype,
        size: stats.size,
        path: uploadPath,
        // Public URL path (backend will serve /uploads as static)
        url: `/uploads/${subDir}/${filename}`,
      };
    } catch (error) {
      // Clean up on error
      if (fs.existsSync(uploadPath)) {
        await fs.promises.unlink(uploadPath);
      }
      throw error;
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      const fullPath = path.join(this.uploadDir, filePath.replace('/uploads/', ''));
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      // Don't throw error, just log it
    }
  }

  async uploadMultipleFiles(
    files: any[],
    subDir: string,
    allowedTypes: string[],
  ): Promise<UploadedFile[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, subDir, allowedTypes));
    return Promise.all(uploadPromises);
  }
}

