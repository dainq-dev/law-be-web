import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { HumanResourcesService } from './staff.service';
import {
  CreateHumanResourceDto,
  UpdateHumanResourceDto,
  HumanResourceResponseDto,
  CreateEducationDto,
  CreateExperienceDto,
  CreateCertificateDto,
  UpdateCertificateDto,
  CertificateResponseDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationOptions } from '@shared/utilities/pagination';
import { LanguageQueryDto, PaginationQueryDto } from '@shared/dto/query.dto';
import { Public } from '@module/auth/decorators/public.decorator';

@Controller('staff')
export class HumanResourcesController {
  constructor(private readonly humanResourcesService: HumanResourcesService) { }

  // Human Resource endpoints
  @Post()
  @Public()
  @ApiOperation({ summary: 'Create new human resource' })
  @ApiResponse({
    status: 201,
    description: 'Human resource created successfully',
    type: HumanResourceResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async create(@Body() createHumanResourceDto: CreateHumanResourceDto): Promise<HumanResourceResponseDto> {
    return this.humanResourcesService.create(createHumanResourceDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all human resources with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'company_id', required: false, type: String })
  @ApiQuery({ name: 'language', required: false, type: String, description: 'Language code (vi, en, zh)' })
  @ApiQuery({ name: 'language_id', required: false, type: String, description: 'Language ID' })
  @ApiResponse({
    status: 200,
    description: 'Human resources retrieved successfully',
  })
  async findAll(
    @Query() options: PaginationQueryDto & { search?: string; company_id?: string },
  ): Promise<{
    data: HumanResourceResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.humanResourcesService.findAll(options);
  }

  @Get('featured')
  @Public()
  @ApiOperation({ summary: 'Get featured human resources' })
  @ApiResponse({
    status: 200,
    description: 'Featured human resources retrieved successfully',
    type: [HumanResourceResponseDto],
  })
  async findFeatured(): Promise<HumanResourceResponseDto[]> {
    return this.humanResourcesService.findFeatured();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get human resource by ID' })
  @ApiQuery({ name: 'language', required: false, type: String, description: 'Language code (vi, en, zh)' })
  @ApiQuery({ name: 'language_id', required: false, type: String, description: 'Language ID' })
  @ApiResponse({
    status: 200,
    description: 'Human resource retrieved successfully',
    type: HumanResourceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Human resource not found' })
  async findOne(
    @Param('id') id: string,
    @Query() languageQuery: LanguageQueryDto,
  ): Promise<HumanResourceResponseDto> {
    return this.humanResourcesService.findOne(id, languageQuery);
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Update human resource' })
  @ApiResponse({
    status: 200,
    description: 'Human resource updated successfully',
    type: HumanResourceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Human resource not found' })
  async update(
    @Param('id') id: string,
    @Body() updateHumanResourceDto: UpdateHumanResourceDto,
  ): Promise<HumanResourceResponseDto> {
    return this.humanResourcesService.update(id, updateHumanResourceDto);
  }

  @Delete(':id')
  @Public()
  @ApiOperation({ summary: 'Delete human resource' })
  @ApiResponse({
    status: 200,
    description: 'Human resource deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Human resource not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.humanResourcesService.remove(id);
  }

  // Education endpoints
  @Post(':id/educations')
  @Public()
  @ApiOperation({ summary: 'Add education to human resource' })
  @ApiResponse({
    status: 201,
    description: 'Education added successfully',
  })
  async createEducation(
    @Param('id') humanResourceId: string,
    @Body() createEducationDto: CreateEducationDto,
  ) {
    return this.humanResourcesService.createEducation({
      ...createEducationDto,
      human_resource_id: humanResourceId,
    });
  }

  @Get(':id/educations')
  @ApiOperation({ summary: 'Get educations for human resource' })
  @ApiResponse({
    status: 200,
    description: 'Educations retrieved successfully',
  })
  async findEducationsByHumanResourceId(@Param('id') humanResourceId: string) {
    return this.humanResourcesService.findEducationsByHumanResourceId(humanResourceId);
  }

  // Experience endpoints
  @Post(':id/experiences')
  @Public()
  @ApiOperation({ summary: 'Add experience to human resource' })
  @ApiResponse({
    status: 201,
    description: 'Experience added successfully',
  })
  async createExperience(
    @Param('id') humanResourceId: string,
    @Body() createExperienceDto: CreateExperienceDto,
  ) {
    return this.humanResourcesService.createExperience({
      ...createExperienceDto,
      human_resource_id: humanResourceId,
    });
  }

  // Experience endpoints
  @Put(':id/experiences')
  @Public()
  @ApiOperation({ summary: 'Add experience to human resource' })
  @ApiResponse({
    status: 201,
    description: 'Experience added successfully',
  })
  async updateExperience(
    @Param('id') humanResourceId: string,
    @Body() createExperienceDto: CreateExperienceDto,
  ) {
    return this.humanResourcesService.updateExperience(humanResourceId, {
      ...createExperienceDto,
    });
  }

  @Get(':id/experiences')
  @Public()
  @ApiOperation({ summary: 'Get experiences for human resource' })
  @ApiResponse({
    status: 200,
    description: 'Experiences retrieved successfully',
  })
  async findExperiencesByHumanResourceId(@Param('id') humanResourceId: string) {
    return this.humanResourcesService.findExperiencesByHumanResourceId(humanResourceId);
  }

  // Certificate endpoints
  @Post(':id/certificates')
  @Public()
  @ApiOperation({ summary: 'Add certificate to human resource' })
  @ApiResponse({
    status: 201,
    description: 'Certificate added successfully',
    type: CertificateResponseDto,
  })
  async createCertificate(
    @Param('id') humanResourceId: string,
    @Body() createCertificateDto: CreateCertificateDto,
  ): Promise<CertificateResponseDto> {
    return this.humanResourcesService.createCertificate({
      ...createCertificateDto,
      human_resource_id: humanResourceId,
    });
  }

  @Get(':id/certificates')
  @Public()
  @ApiOperation({ summary: 'Get certificates for human resource' })
  @ApiResponse({
    status: 200,
    description: 'Certificates retrieved successfully',
    type: [CertificateResponseDto],
  })
  async findCertificatesByHumanResourceId(@Param('id') humanResourceId: string): Promise<CertificateResponseDto[]> {
    return this.humanResourcesService.findCertificatesByHumanResourceId(humanResourceId);
  }

  @Get('certificates/:certId')
  @Public()
  @ApiOperation({ summary: 'Get certificate by ID' })
  @ApiResponse({
    status: 200,
    description: 'Certificate retrieved successfully',
    type: CertificateResponseDto,
  })
  async findCertificateById(@Param('certId') certId: string): Promise<CertificateResponseDto> {
    return this.humanResourcesService.findCertificateById(certId);
  }

  @Patch('certificates/:certId')
  @Public()
  @ApiOperation({ summary: 'Update certificate' })
  @ApiResponse({
    status: 200,
    description: 'Certificate updated successfully',
    type: CertificateResponseDto,
  })
  async updateCertificate(
    @Param('certId') certId: string,
    @Body() updateCertificateDto: UpdateCertificateDto,
  ): Promise<CertificateResponseDto> {
    return this.humanResourcesService.updateCertificate(certId, updateCertificateDto);
  }

  @Delete('certificates/:certId')
  @Public()
  @ApiOperation({ summary: 'Delete certificate' })
  @ApiResponse({
    status: 200,
    description: 'Certificate deleted successfully',
  })
  async deleteCertificate(@Param('certId') certId: string): Promise<{ message: string }> {
    return this.humanResourcesService.deleteCertificate(certId);
  }

  // Upload avatar endpoint
  @Post(':id/avatar')
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload avatar for human resource' })
  @ApiResponse({
    status: 200,
    description: 'Avatar uploaded successfully',
  })
  async uploadAvatar(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    try {
      console.log('Upload avatar - Received file:', {
        filename: file?.filename,
        mimetype: file?.mimetype,
        size: file?.size,
        originalname: file?.originalname
      });

      if (!file) {
        throw new BadRequestException('No file provided');
      }

      const result = await this.humanResourcesService.uploadAvatar(id, file);
      return {
        message: 'Avatar uploaded successfully',
        data: result,
      };
    } catch (error) {
      console.error('Upload avatar error:', error);
      throw error;
    }
  }
}
