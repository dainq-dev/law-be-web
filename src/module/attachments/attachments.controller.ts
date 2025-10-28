import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AttachmentsService, UploadAttachmentDto, AttachmentResponseDto } from './attachments.service';
import { Public } from '@module/auth/decorators/public.decorator';

@ApiTags('Attachments')
@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post('upload')
  @Public()
  @ApiOperation({ summary: 'Upload multiple files (all-or-nothing)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Files uploaded successfully',
    type: [AttachmentResponseDto],
  })
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
  async uploadFiles(
    @UploadedFiles() files: any[],
    @Body() uploadDto: UploadAttachmentDto,
  ): Promise<AttachmentResponseDto[]> {
    return this.attachmentsService.uploadMultipleFiles(files, uploadDto);
  }
  
  @Post('upload-partial')
  @Public()
  @ApiOperation({ summary: 'Upload multiple files (partial success allowed)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Files uploaded with partial success',
    schema: {
      type: 'object',
      properties: {
        successful: {
          type: 'array',
          items: { $ref: '#/components/schemas/AttachmentResponseDto' }
        },
        failed: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              file: { type: 'object' },
              error: { type: 'string' }
            }
          }
        }
      }
    }
  })
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
  @Public()
  async uploadFilesPartial(
    @UploadedFiles() files: any[],
    @Body() uploadDto: UploadAttachmentDto,
  ): Promise<{
    successful: AttachmentResponseDto[];
    failed: { file: any; error: string }[];
  }> {
    return this.attachmentsService.uploadMultipleFilesPartial(files, uploadDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attachments' })
  @ApiResponse({
    status: 200,
    description: 'All attachments retrieved successfully',
    type: [AttachmentResponseDto],
  })
  async getAllAttachments(): Promise<AttachmentResponseDto[]> {
    try {
      const result = await this.attachmentsService.getAllAttachments();
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Get('type/:fileType')
  @ApiOperation({ summary: 'Get attachments by file type' })
  @ApiResponse({
    status: 200,
    description: 'Attachments by type retrieved successfully',
    type: [AttachmentResponseDto],
  })
  async getAttachmentsByType(
    @Param('fileType') fileType: string,
  ): Promise<AttachmentResponseDto[]> {
    return this.attachmentsService.getAttachmentsByType(fileType);
  }

  @Get('types')
  @ApiOperation({ summary: 'Get all file types' })
  @ApiResponse({
    status: 200,
    description: 'All file types retrieved successfully',
    schema: {
      type: 'array',
      items: { type: 'string' },
    },
  })
  async getAllFileTypes(): Promise<string[]> {
    return this.attachmentsService.getAllFileTypes();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete attachment' })
  @ApiResponse({
    status: 200,
    description: 'Attachment deleted successfully',
  })
  async deleteAttachment(@Param('id') id: string): Promise<{ message: string }> {
    await this.attachmentsService.deleteAttachment(id);
    return { message: 'Attachment deleted successfully' };
  }
}
