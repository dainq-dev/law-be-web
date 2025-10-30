import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
import { LanguageQueryDto, PaginationQueryDto } from '@shared/dto/query.dto';
import { Public } from '@module/auth/decorators/public.decorator';

@Controller('staff')
export class HumanResourcesController {
  constructor(private readonly humanResourcesService: HumanResourcesService) { }

  @Post()
  @Public()
  async create(@Body() createHumanResourceDto: CreateHumanResourceDto): Promise<HumanResourceResponseDto> {
    return this.humanResourcesService.create(createHumanResourceDto);
  }

  @Get()
  @Public()
  async findAll(
    @Query() options: PaginationQueryDto & { search?: string },
  ): Promise<any> {
    return this.humanResourcesService.findAll(options);
  }

  @Get('featured')
  @Public()
  async findFeatured(): Promise<HumanResourceResponseDto[]> {
    return this.humanResourcesService.findFeatured();
  }

  @Get(':id')
  @Public()
  async findOne(
    @Param('id') id: string,
    @Query() languageQuery: LanguageQueryDto,
  ): Promise<HumanResourceResponseDto> {
    return this.humanResourcesService.findOne(id, languageQuery);
  }

  @Patch(':id')
  @Public()
  async update(
    @Param('id') id: string,
    @Body() updateHumanResourceDto: UpdateHumanResourceDto,
  ): Promise<HumanResourceResponseDto> {
    return this.humanResourcesService.update(id, updateHumanResourceDto);
  }

  @Delete(':id')
  @Public()
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.humanResourcesService.remove(id);
  }

  // Education endpoints
  @Post(':id/educations')
  @Public()
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
  async findEducationsByHumanResourceId(@Param('id') humanResourceId: string, @Query() languageQuery: LanguageQueryDto) {
    return this.humanResourcesService.findEducationsByHumanResourceId(humanResourceId, languageQuery);
  }

  // Experience endpoints
  @Post(':id/experiences')
  @Public()
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
  async findExperiencesByHumanResourceId(@Param('id') humanResourceId: string, @Query() languageQuery: LanguageQueryDto) {
    return this.humanResourcesService.findExperiencesByHumanResourceId(humanResourceId, languageQuery);
  }

  // Certificate endpoints
  @Post(':id/certificates')
  @Public()
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
  async findCertificatesByHumanResourceId(@Param('id') humanResourceId: string, @Query() languageQuery: LanguageQueryDto): Promise<CertificateResponseDto[]> {
    return this.humanResourcesService.findCertificatesByHumanResourceId(humanResourceId, languageQuery);
  }

  @Get('certificates/:certId')
  @Public()
  async findCertificateById(@Param('certId') certId: string): Promise<CertificateResponseDto> {
    return this.humanResourcesService.findCertificateById(certId);
  }

  @Patch('certificates/:certId')
  @Public()
  async updateCertificate(
    @Param('certId') certId: string,
    @Body() updateCertificateDto: UpdateCertificateDto,
  ): Promise<CertificateResponseDto> {
    return this.humanResourcesService.updateCertificate(certId, updateCertificateDto);
  }

  @Delete('certificates/:certId')
  @Public()
  async deleteCertificate(@Param('certId') certId: string): Promise<{ message: string }> {
    return this.humanResourcesService.deleteCertificate(certId);
  }

  // Upload avatar endpoint
  @Post(':id/avatar')
  @Public()
  @UseInterceptors(FileInterceptor('file'))
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
