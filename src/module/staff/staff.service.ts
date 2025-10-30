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
import { HumanResourceEntity } from '@shared/entities';
import { LanguageQueryDto } from '@shared/dto/query.dto';

@Injectable()
export class HumanResourcesService {
  constructor(
    private readonly humanResourcesRepository: HumanResourcesRepository,
    private readonly uploadService: UploadService,
  ) {}

  // Human Resource methods
  async create(createHumanResourceDto: CreateHumanResourceDto): Promise<HumanResourceResponseDto> {
    // Check if email already exists
    const existingHumanResource = await this.humanResourcesRepository.findByEmail(
      createHumanResourceDto.email
    );
    if (existingHumanResource) {
      throw new ConflictException('Email already exists');
    }

    // Create human resource with multilingual fields
    const humanResource = await this.humanResourcesRepository.create({
      ...createHumanResourceDto,
      is_active: createHumanResourceDto.is_active ?? true,
      date_of_birth: createHumanResourceDto.date_of_birth ? new Date(createHumanResourceDto.date_of_birth) : undefined,
    });

    return this.toHumanResourceResponseDto(humanResource);
  }

  async findAll(options: PaginationQueryDto & { search?: string }): Promise<{
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
    };

    const result = await this.humanResourcesRepository.findAll(validatedOptions);

    // Get language from either language_code or language (compat)
    const languageCode = options.language_code || (options as any).language || null;

    return {
      ...result,
      data: result.data.map(hr => this.toHumanResourceResponseDto(hr, null, languageCode)),
    };
  }

  async findOne(id: string, languageQuery?: LanguageQueryDto): Promise<HumanResourceResponseDto> {
    const humanResource = await this.humanResourcesRepository.findById(id);
    if (!humanResource) {
      throw new NotFoundException('Human resource not found');
    }

    // Get language code for translation
    const languageCode = languageQuery?.language_code || languageQuery?.language || null;

    return this.toHumanResourceResponseDto(humanResource, null, languageCode);
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

    // Convert date string to Date object if provided
    const updateData: any = { ...updateHumanResourceDto };
    if (updateHumanResourceDto.date_of_birth) {
      updateData.date_of_birth = new Date(updateHumanResourceDto.date_of_birth);
    }

    const updatedHumanResource = await this.humanResourcesRepository.update(id, updateData);

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
      degree_vi: createEducationDto.degree_vi,
      degree_en: createEducationDto.degree_en,
      degree_zh: createEducationDto.degree_zh,
      university_vi: createEducationDto.university_vi,
      university_en: createEducationDto.university_en,
      university_zh: createEducationDto.university_zh,
      field_of_study_vi: createEducationDto.field_of_study_vi,
      field_of_study_en: createEducationDto.field_of_study_en,
      field_of_study_zh: createEducationDto.field_of_study_zh,
      description_vi: createEducationDto.description_vi ?? null,
      description_en: createEducationDto.description_en ?? null,
      description_zh: createEducationDto.description_zh ?? null,
      from: createEducationDto.start_date ? new Date(createEducationDto.start_date) : undefined,
      to: createEducationDto.end_date ? new Date(createEducationDto.end_date) : undefined,
      staff_id: createEducationDto.human_resource_id,
    };
    console.log('Education data to save:', educationData);
    const education = await this.humanResourcesRepository.createEducation(educationData);
    console.log('Created education:', education);
    return education;
  }

  async findEducationsByHumanResourceId(humanResourceId: string, languageQuery?: LanguageQueryDto) {
    const educations = await this.humanResourcesRepository.findEducationsByHumanResourceId(humanResourceId);

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

    // Map DTO fields to entity fields (all multilingual fields)
    const updateData: any = {};
    if (updateEducationDto.degree_vi !== undefined) updateData.degree_vi = updateEducationDto.degree_vi;
    if (updateEducationDto.degree_en !== undefined) updateData.degree_en = updateEducationDto.degree_en;
    if (updateEducationDto.degree_zh !== undefined) updateData.degree_zh = updateEducationDto.degree_zh;
    if (updateEducationDto.university_vi !== undefined) updateData.university_vi = updateEducationDto.university_vi;
    if (updateEducationDto.university_en !== undefined) updateData.university_en = updateEducationDto.university_en;
    if (updateEducationDto.university_zh !== undefined) updateData.university_zh = updateEducationDto.university_zh;
    if (updateEducationDto.field_of_study_vi !== undefined) updateData.field_of_study_vi = updateEducationDto.field_of_study_vi;
    if (updateEducationDto.field_of_study_en !== undefined) updateData.field_of_study_en = updateEducationDto.field_of_study_en;
    if (updateEducationDto.field_of_study_zh !== undefined) updateData.field_of_study_zh = updateEducationDto.field_of_study_zh;
    if (updateEducationDto.description_vi !== undefined) updateData.description_vi = updateEducationDto.description_vi ?? null;
    if (updateEducationDto.description_en !== undefined) updateData.description_en = updateEducationDto.description_en ?? null;
    if (updateEducationDto.description_zh !== undefined) updateData.description_zh = updateEducationDto.description_zh ?? null;
    if (updateEducationDto.start_date) {
      updateData.from = new Date(updateEducationDto.start_date);
    }
    if (updateEducationDto.end_date) {
      updateData.to = new Date(updateEducationDto.end_date);
    }

    return this.humanResourcesRepository.updateEducation(id, updateData);
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
      company_vi: createExperienceDto.company_vi,
      company_en: createExperienceDto.company_en,
      company_zh: createExperienceDto.company_zh,
      position_vi: createExperienceDto.position_vi,
      position_en: createExperienceDto.position_en,
      position_zh: createExperienceDto.position_zh,
      description_vi: createExperienceDto.description_vi ?? null,
      description_en: createExperienceDto.description_en ?? null,
      description_zh: createExperienceDto.description_zh ?? null,
      start_date: createExperienceDto.start_date ? new Date(createExperienceDto.start_date) : undefined,
      end_date: createExperienceDto.end_date ? new Date(createExperienceDto.end_date) : undefined,
      // set relation so staff_id is persisted
      staff: { id: createExperienceDto.human_resource_id } as any,
      staff_id: createExperienceDto.human_resource_id,
    };
    console.log('Experience data to save:', experienceData);
    const experience = await this.humanResourcesRepository.createExperience(experienceData);
    console.log('Created experience:', experience);
    return experience;
  }

  async findExperiencesByHumanResourceId(humanResourceId: string, languageQuery?: LanguageQueryDto) {
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
    if (!experience) {
      throw new NotFoundException('Experience not found');
    }

    // Map DTO fields to entity fields (all multilingual fields)
    const updateData: any = {};
    if (updateExperienceDto.position_vi !== undefined) updateData.position_vi = updateExperienceDto.position_vi;
    if (updateExperienceDto.position_en !== undefined) updateData.position_en = updateExperienceDto.position_en;
    if (updateExperienceDto.position_zh !== undefined) updateData.position_zh = updateExperienceDto.position_zh;
    if (updateExperienceDto.company_vi !== undefined) updateData.company_vi = updateExperienceDto.company_vi;
    if (updateExperienceDto.company_en !== undefined) updateData.company_en = updateExperienceDto.company_en;
    if (updateExperienceDto.company_zh !== undefined) updateData.company_zh = updateExperienceDto.company_zh;
    if (updateExperienceDto.description_vi !== undefined) updateData.description_vi = updateExperienceDto.description_vi ?? null;
    if (updateExperienceDto.description_en !== undefined) updateData.description_en = updateExperienceDto.description_en ?? null;
    if (updateExperienceDto.description_zh !== undefined) updateData.description_zh = updateExperienceDto.description_zh ?? null;
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


  private toHumanResourceResponseDto(humanResource: HumanResourceEntity, languageId?: string | null, languageCode?: string | null): HumanResourceResponseDto {
    // If language code is specified, merge the fields for that language into the base fields
    let responseData = plainToClass(HumanResourceResponseDto, humanResource, {
      excludeExtraneousValues: true,
    });

    // If a specific language code is requested, we still return all fields but can prioritize that language in the response
    // The response DTO already contains all language fields, so just return as is
    return responseData;
  }

  // Certificate methods
  async createCertificate(createCertificateDto: CreateCertificateDto): Promise<CertificateResponseDto> {
    const { human_resource_id, name_vi, name_en, name_zh, issuing_organization_vi, issuing_organization_en, issuing_organization_zh, description_vi, description_en, description_zh, issue_date, expiration_date, credential_id, credential_url } = createCertificateDto;

    // Verify human resource exists
    const humanResource = await this.humanResourcesRepository.findById(human_resource_id);
    if (!humanResource) {
      throw new NotFoundException('Human resource not found');
    }

    // Map DTO fields to entity fields (all multilingual fields)
    const certificateData = {
      name_vi,
      name_en,
      name_zh,
      issuing_organization_vi: issuing_organization_vi ?? null,
      issuing_organization_en: issuing_organization_en ?? null,
      issuing_organization_zh: issuing_organization_zh ?? null,
      description_vi: description_vi ?? null,
      description_en: description_en ?? null,
      description_zh: description_zh ?? null,
      issue_date: issue_date ? ((issue_date as any) instanceof Date ? issue_date : new Date(issue_date)) : undefined,
      expiration_date: expiration_date ? ((expiration_date as any) instanceof Date ? expiration_date : new Date(expiration_date)) : undefined,
      credential_id: credential_id ?? null,
      credential_url: credential_url ?? null,
      staff_id: human_resource_id,
      staff: { id: human_resource_id } as any,
    };

    const certificate = await this.humanResourcesRepository.createCertificate(certificateData);
    return this.toCertificateResponseDto(certificate);
  }

  async findCertificatesByHumanResourceId(humanResourceId: string, languageQuery?: LanguageQueryDto): Promise<CertificateResponseDto[]> {
    const certificates = await this.humanResourcesRepository.findCertificatesByHumanResourceId(humanResourceId);

    const merged = certificates

    return merged.map(cert => this.toCertificateResponseDto(cert));
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

    // Map DTO fields to entity fields (all multilingual fields)
    const updateData: any = {};
    if (updateCertificateDto.name_vi !== undefined) updateData.name_vi = updateCertificateDto.name_vi;
    if (updateCertificateDto.name_en !== undefined) updateData.name_en = updateCertificateDto.name_en;
    if (updateCertificateDto.name_zh !== undefined) updateData.name_zh = updateCertificateDto.name_zh;
    if (updateCertificateDto.issuing_organization_vi !== undefined) updateData.issuing_organization_vi = updateCertificateDto.issuing_organization_vi ?? null;
    if (updateCertificateDto.issuing_organization_en !== undefined) updateData.issuing_organization_en = updateCertificateDto.issuing_organization_en ?? null;
    if (updateCertificateDto.issuing_organization_zh !== undefined) updateData.issuing_organization_zh = updateCertificateDto.issuing_organization_zh ?? null;
    if (updateCertificateDto.description_vi !== undefined) updateData.description_vi = updateCertificateDto.description_vi ?? null;
    if (updateCertificateDto.description_en !== undefined) updateData.description_en = updateCertificateDto.description_en ?? null;
    if (updateCertificateDto.description_zh !== undefined) updateData.description_zh = updateCertificateDto.description_zh ?? null;
    if (updateCertificateDto.issue_date) {
      updateData.issue_date = (updateCertificateDto.issue_date as any) instanceof Date 
        ? updateCertificateDto.issue_date 
        : new Date(updateCertificateDto.issue_date as string);
    }
    if (updateCertificateDto.expiration_date) {
      updateData.expiration_date = (updateCertificateDto.expiration_date as any) instanceof Date
        ? updateCertificateDto.expiration_date
        : new Date(updateCertificateDto.expiration_date as string);
    }
    if (updateCertificateDto.credential_id !== undefined) {
      updateData.credential_id = updateCertificateDto.credential_id;
    }
    if (updateCertificateDto.credential_url !== undefined) {
      updateData.credential_url = updateCertificateDto.credential_url;
    }

    const updated = await this.humanResourcesRepository.updateCertificate(id, updateData);
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
    // Map entity fields to DTO fields for backward compatibility
    const mappedCert = {
      ...certificate,
      human_resource_id: certificate.human_resource_id || certificate.staff_id,
    };

    return plainToClass(CertificateResponseDto, mappedCert, {
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

  // Translation methods removed - translations are now stored as columns in the main entity
}
