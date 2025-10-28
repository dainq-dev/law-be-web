import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { HumanResourcesRepository } from './staff.repository';
import { PaginationOptions } from '@shared/utilities/pagination';
import { PaginationQueryDto } from '@shared/dto/query.dto';
import { plainToClass } from 'class-transformer';
import { UploadService, UploadedFile } from '@shared/services/upload.service';
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
import { HumanResourceEntity, HumanResourceTranslationEntity } from '@shared/entities';
import { TranslationService } from '@shared/services/translation.service';
import { LanguageQueryDto } from '@shared/dto/query.dto';

@Injectable()
export class HumanResourcesService {
  constructor(
    private readonly humanResourcesRepository: HumanResourcesRepository,
    private readonly translationService: TranslationService,
    private readonly uploadService: UploadService,
  ) {}

  // Human Resource methods
  async create(createHumanResourceDto: CreateHumanResourceDto): Promise<HumanResourceResponseDto> {
    const { first_name, last_name, company_name, translations, ...humanResourceData } = createHumanResourceDto;

    // Check if email already exists
    const existingHumanResource = await this.humanResourcesRepository.findByEmail(
      createHumanResourceDto.email
    );
    if (existingHumanResource) {
      throw new ConflictException('Email already exists');
    }

    // Create full name
    const full_name = `${first_name} ${last_name}`.trim();

    // Create human resource
    const humanResource = await this.humanResourcesRepository.create({
      ...humanResourceData,
      first_name,
      last_name,
      full_name,
      is_active: createHumanResourceDto.is_active ?? true,
      date_of_birth: createHumanResourceDto.date_of_birth ? new Date(createHumanResourceDto.date_of_birth) : undefined,
    });

    // Create translations if provided
    if (translations && translations.length > 0) {
      await this.createTranslations(humanResource.id, translations);
    }

    return this.toHumanResourceResponseDto(humanResource);
  }

  async findAll(options: PaginationQueryDto & { search?: string; company_name?: string }): Promise<{
    data: HumanResourceResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const validatedOptions = {
      page: options.page,
      limit: options.limit,
      search: options.search,
      company_name: options.company_name,
    };

    const result = await this.humanResourcesRepository.findAll(validatedOptions);

    // Get language ID for translation
    const languageId = await this.translationService.getLanguageId(options.language || options.language_id);

    return {
      ...result,
      data: result.data.map(hr => this.toHumanResourceResponseDto(hr, languageId)),
    };
  }

  async findOne(id: string, languageQuery?: LanguageQueryDto): Promise<HumanResourceResponseDto> {
    const humanResource = await this.humanResourcesRepository.findById(id);
    if (!humanResource) {
      throw new NotFoundException('Human resource not found');
    }

    // Get language ID for translation
    const languageId = languageQuery ? 
      await this.translationService.getLanguageId(languageQuery.language || languageQuery.language_id) : 
      null;

    return this.toHumanResourceResponseDto(humanResource, languageId);
  }

  async update(id: string, updateHumanResourceDto: UpdateHumanResourceDto): Promise<HumanResourceResponseDto> {
    const humanResource = await this.humanResourcesRepository.findById(id);
    if (!humanResource) {
      throw new NotFoundException('Human resource not found');
    }

    // Check if email is being changed and if it already exists
    if (updateHumanResourceDto.email && updateHumanResourceDto.email !== humanResource.email) {
      const existingHumanResource = await this.humanResourcesRepository.findByEmail(
        updateHumanResourceDto.email
      );
      if (existingHumanResource) {
        throw new ConflictException('Email already exists');
      }
    }

    // Update full name if first_name or last_name is being changed
    let full_name = humanResource.full_name;
    if (updateHumanResourceDto.first_name || updateHumanResourceDto.last_name) {
      const first_name = updateHumanResourceDto.first_name || humanResource.first_name;
      const last_name = updateHumanResourceDto.last_name || humanResource.last_name;
      full_name = `${first_name} ${last_name}`.trim();
    }

    // Convert date string to Date object if provided
    const updateData: any = { ...updateHumanResourceDto };
    if (updateHumanResourceDto.date_of_birth) {
      updateData.date_of_birth = new Date(updateHumanResourceDto.date_of_birth);
    }

    const updatedHumanResource = await this.humanResourcesRepository.update(id, {
      ...updateData,
      full_name,
    });

    return this.toHumanResourceResponseDto(updatedHumanResource);
  }

  async remove(id: string): Promise<{ message: string }> {
    const humanResource = await this.humanResourcesRepository.findById(id);
    if (!humanResource) {
      throw new NotFoundException('Human resource not found');
    }

    await this.humanResourcesRepository.delete(id);
    return { message: 'Human resource deleted successfully' };
  }

  async findFeatured(): Promise<HumanResourceResponseDto[]> {
    const featuredHumanResources = await this.humanResourcesRepository.findFeatured();
    return featuredHumanResources.map(hr => this.toHumanResourceResponseDto(hr));
  }

  // Education methods
  async createEducation(createEducationDto: CreateEducationDto) {
    console.log('Creating education with data:', createEducationDto);
    
    // Verify human resource exists
    const humanResource = await this.humanResourcesRepository.findById(createEducationDto.human_resource_id);
    if (!humanResource) {
      throw new NotFoundException('Human resource not found');
    }
    
    const educationData = {
      degree: createEducationDto.degree,
      university: createEducationDto.institution, // map field name
      field_of_study: createEducationDto.field_of_study,
      from: createEducationDto.start_date ? new Date(createEducationDto.start_date) : undefined,
      to: createEducationDto.end_date ? new Date(createEducationDto.end_date) : undefined,
      grade: createEducationDto.grade,
      description: (createEducationDto as any).description ?? null,
      // set relation so hr_id is persisted
      humanResource: { id: createEducationDto.human_resource_id } as any,
    };
    console.log('Education data to save:', educationData);
    const education = await this.humanResourcesRepository.createEducation(educationData);
    console.log('Created education:', education);
    return education;
  }

  async findEducationsByHumanResourceId(humanResourceId: string) {
    console.log('Finding educations for human resource:', humanResourceId);
    const educations = await this.humanResourcesRepository.findEducationsByHumanResourceId(humanResourceId);
    console.log('Found educations:', educations);
    return educations;
  }

  async findEducationById(id: string) {
    const education = await this.humanResourcesRepository.findEducationById(id);
    if (!education) {
      throw new NotFoundException('Education not found');
    }
    return education;
  }

  async updateEducation(id: string, updateEducationDto: Partial<CreateEducationDto>) {
    const education = await this.humanResourcesRepository.findEducationById(id);
    if (!education) {
      throw new NotFoundException('Education not found');
    }

    return this.humanResourcesRepository.updateEducation(id, updateEducationDto);
  }

  async removeEducation(id: string): Promise<{ message: string }> {
    const education = await this.humanResourcesRepository.findEducationById(id);
    if (!education) {
      throw new NotFoundException('Education not found');
    }

    await this.humanResourcesRepository.deleteEducation(id);
    return { message: 'Education deleted successfully' };
  }

  // Experience methods
  async createExperience(createExperienceDto: CreateExperienceDto) {
    console.log('Creating experience with data:', createExperienceDto);
    
    // Verify human resource exists
    const humanResource = await this.humanResourcesRepository.findById(createExperienceDto.human_resource_id);
    if (!humanResource) {
      throw new NotFoundException('Human resource not found');
    }
    
    const experienceData = {
      company: (createExperienceDto as any).company ?? null,
      position: (createExperienceDto as any).position ?? createExperienceDto.title,
      location: (createExperienceDto as any).location ?? null,
      start_date: createExperienceDto.start_date ? new Date(createExperienceDto.start_date) : undefined,
      end_date: createExperienceDto.end_date ? new Date(createExperienceDto.end_date) : undefined,
      description: (createExperienceDto as any).description ?? null,
      is_current: (createExperienceDto as any).is_current ?? false,
      humanResource: { id: createExperienceDto.human_resource_id } as any,
    };
    console.log('Experience data to save:', experienceData);
    const experience = await this.humanResourcesRepository.createExperience(experienceData);
    console.log('Created experience:', experience);
    return experience;
  }

  async findExperiencesByHumanResourceId(humanResourceId: string) {
    const experiences = await this.humanResourcesRepository.findExperiencesByHumanResourceId(humanResourceId);
    return experiences;
  }

  async findExperienceById(id: string) {
    const experience = await this.humanResourcesRepository.findExperienceById(id);
    if (!experience) {
      throw new NotFoundException('Experience not found');
    }
    return experience;
  }

  async updateExperience(id: string, updateExperienceDto: Partial<CreateExperienceDto>) {
    const experience = await this.humanResourcesRepository.findExperienceById(id);
    console.log("🚀 ~ HumanResourcesService ~ updateExperience ~ experience:", experience)
    if (!experience) {
      throw new NotFoundException('Experience not found');
    }

    const updateData: any = { ...updateExperienceDto };
    if (updateExperienceDto.start_date) {
      updateData.start_date = new Date(updateExperienceDto.start_date);
    }
    if (updateExperienceDto.end_date) {
      updateData.end_date = new Date(updateExperienceDto.end_date);
    }

    return this.humanResourcesRepository.updateExperience(id, updateData);
  }

  async removeExperience(id: string): Promise<{ message: string }> {
    const experience = await this.humanResourcesRepository.findExperienceById(id);
    if (!experience) {
      throw new NotFoundException('Experience not found');
    }

    await this.humanResourcesRepository.deleteExperience(id);
    return { message: 'Experience deleted successfully' };
  }

  private async createTranslations(humanResourceId: string, translations: any[]): Promise<void> {
    for (const translation of translations) {
      await this.humanResourcesRepository.createTranslation({
        ...translation,
        human_resource_id: humanResourceId,
      });
    }
  }

  private toHumanResourceResponseDto(humanResource: HumanResourceEntity, languageId?: string | null): HumanResourceResponseDto {
    let responseData = plainToClass(HumanResourceResponseDto, humanResource, {
      excludeExtraneousValues: true,
    });

    // If language ID is provided, try to get translation
    if (languageId && humanResource.translations) {
      const translation = this.translationService.getTranslation(humanResource, languageId);
      if (translation) {
        responseData = this.translationService.mergeWithTranslation(responseData, translation);
      }
    }

    return responseData;
  }

  // Certificate methods
  async createCertificate(createCertificateDto: CreateCertificateDto): Promise<CertificateResponseDto> {
    const { human_resource_id } = createCertificateDto;

    // Verify human resource exists
    const humanResource = await this.humanResourcesRepository.findById(human_resource_id);
    if (!humanResource) {
      throw new NotFoundException('Human resource not found');
    }

    const certificate = await this.humanResourcesRepository.createCertificate(createCertificateDto);
    return this.toCertificateResponseDto(certificate);
  }

  async findCertificatesByHumanResourceId(humanResourceId: string): Promise<CertificateResponseDto[]> {
    const certificates = await this.humanResourcesRepository.findCertificatesByHumanResourceId(humanResourceId);
    return certificates.map(cert => this.toCertificateResponseDto(cert));
  }

  async findCertificateById(id: string): Promise<CertificateResponseDto> {
    const certificate = await this.humanResourcesRepository.findCertificateById(id);
    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }
    return this.toCertificateResponseDto(certificate);
  }

  async updateCertificate(id: string, updateCertificateDto: UpdateCertificateDto): Promise<CertificateResponseDto> {
    const certificate = await this.humanResourcesRepository.findCertificateById(id);
    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    const updated = await this.humanResourcesRepository.updateCertificate(id, updateCertificateDto);
    return this.toCertificateResponseDto(updated);
  }

  async deleteCertificate(id: string): Promise<{ message: string }> {
    const certificate = await this.humanResourcesRepository.findCertificateById(id);
    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    await this.humanResourcesRepository.deleteCertificate(id);
    return { message: 'Certificate deleted successfully' };
  }

  private toCertificateResponseDto(certificate: any): CertificateResponseDto {
    return plainToClass(CertificateResponseDto, certificate, {
      excludeExtraneousValues: true,
    });
  }

  // File upload methods
  async uploadAvatar(id: string, file: any): Promise<{ url: string; message: string }> {
    console.log('StaffService.uploadAvatar - Received file:', {
      file: file,
      mimetype: file?.mimetype,
      filename: file?.filename,
      size: file?.size
    });
    
    if (!file) {
      console.error('No file provided');
      throw new BadRequestException('No file provided');
    }

    const humanResource = await this.humanResourcesRepository.findById(id);
    if (!humanResource) {
      throw new NotFoundException('Human resource not found');
    }

    // Delete old avatar if exists
    if (humanResource.avatar_url) {
      await this.uploadService.deleteFile(humanResource.avatar_url);
    }

    // Upload new avatar
    const uploaded = await this.uploadService.uploadAvatar(file);

    // Update human resource with new avatar URL
    const updated = await this.humanResourcesRepository.update(id, {
      avatar_url: uploaded.url,
    });

    return {
      url: uploaded.url,
      message: 'Avatar uploaded successfully',
    };
  }
}
