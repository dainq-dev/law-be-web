import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HumanResourceEntity, HumanResourceTranslationEntity } from '@shared/entities/staff.entity';
import { EducationEntity } from '@shared/entities/education.entity';
import { ExperienceEntity } from '@shared/entities/experience.entity';
import { CertificateEntity } from '@shared/entities/certificate.entity';
import { PaginationOptions } from '@shared/utilities/pagination';

@Injectable()
export class HumanResourcesRepository {
  constructor(
    @InjectRepository(HumanResourceEntity)
    private readonly humanResourceRepository: Repository<HumanResourceEntity>,
    @InjectRepository(EducationEntity)
    private readonly educationRepository: Repository<EducationEntity>,
    @InjectRepository(ExperienceEntity)
    private readonly experienceRepository: Repository<ExperienceEntity>,
    @InjectRepository(CertificateEntity)
    private readonly certificateRepository: Repository<CertificateEntity>,
    @InjectRepository(HumanResourceTranslationEntity)
    private readonly translationRepository: Repository<HumanResourceTranslationEntity>,
  ) {}

  // Human Resource methods
  async create(humanResourceData: Partial<HumanResourceEntity>): Promise<HumanResourceEntity> {
    const humanResource = this.humanResourceRepository.create(humanResourceData);
    return this.humanResourceRepository.save(humanResource);
  }

  async findAll(options: PaginationOptions & { search?: string; company_id?: string }): Promise<{
    data: HumanResourceEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page, limit, search, company_id } = options;
    
    // Ensure page and limit are valid numbers
    const validPage = typeof page === 'number' && !isNaN(page) && page > 0 ? page : 1;
    const validLimit = typeof limit === 'number' && !isNaN(limit) && limit > 0 ? limit : 10;
    
    const skip = (validPage - 1) * validLimit;

    const queryBuilder = this.humanResourceRepository
      .createQueryBuilder('hr')
      .leftJoinAndSelect('hr.educations', 'educations')
      .leftJoinAndSelect('hr.experiences', 'experiences')
      .leftJoinAndSelect('hr.translations', 'translations')
      .leftJoinAndSelect('translations.language', 'language')
      .skip(skip)
      .take(validLimit)
      .orderBy('hr.created_at', 'DESC');

    if (search) {
      queryBuilder.where(
        '(hr.first_name ILIKE :search OR hr.last_name ILIKE :search OR hr.full_name ILIKE :search OR hr.position ILIKE :search OR hr.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (company_id) {
      queryBuilder.andWhere('hr.company_id = :company_id', { company_id });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page: validPage,
      limit: validLimit,
      totalPages: Math.ceil(total / validLimit),
    };
  }

  async findById(id: string): Promise<HumanResourceEntity | null> {
    return this.humanResourceRepository.findOne({
      where: { id },
      relations: ['educations', 'experiences', 'certificates', 'translations', 'translations.language'],
    });
  }

  async findByEmail(email: string): Promise<HumanResourceEntity | null> {
    return this.humanResourceRepository.findOne({
      where: { email },
      relations: ['educations', 'experiences'],
    });
  }

  async update(id: string, humanResourceData: Partial<HumanResourceEntity>): Promise<HumanResourceEntity> {
    await this.humanResourceRepository.update(id, humanResourceData);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Human resource not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.humanResourceRepository.delete(id);
  }

  async findFeatured(): Promise<HumanResourceEntity[]> {
    return this.humanResourceRepository.find({
      where: { is_active: true },
      relations: ['educations', 'experiences'],
    });
  }

  // Education methods
  async createEducation(educationData: Partial<EducationEntity>): Promise<EducationEntity> {
    console.log('Repository: Creating education with data:', educationData);
    const education = this.educationRepository.create(educationData);
    console.log('Repository: Created education entity:', education);
    const savedEducation = await this.educationRepository.save(education);
    console.log('Repository: Saved education:', savedEducation);
    return savedEducation;
  }

  async findEducationsByHumanResourceId(humanResourceId: string): Promise<EducationEntity[]> {
    console.log('Repository: Finding educations for human resource:', humanResourceId);
    
    // Query by hr_id column (the actual foreign key)
    const result = await this.educationRepository.find({
      where: { hr_id: humanResourceId },
      relations: ['humanResource'],
      order: { from: 'DESC' },
    });
    console.log('Repository: Found educations:', result.length, result);
    
    return result;
  }

  async findEducationById(id: string): Promise<EducationEntity | null> {
    return this.educationRepository.findOne({
      where: { id },
      relations: ['humanResource'],
    });
  }

  async updateEducation(id: string, educationData: Partial<EducationEntity>): Promise<EducationEntity> {
    await this.educationRepository.update(id, educationData);
    const updated = await this.findEducationById(id);
    if (!updated) {
      throw new Error('Education not found after update');
    }
    return updated;
  }

  async deleteEducation(id: string): Promise<void> {
    await this.educationRepository.delete(id);
  }

  // Experience methods
  async createExperience(experienceData: Partial<ExperienceEntity>): Promise<ExperienceEntity> {
    console.log('Repository: Creating experience with data:', experienceData);
    const experience = this.experienceRepository.create(experienceData);
    console.log('Repository: Created experience entity:', experience);
    const savedExperience = await this.experienceRepository.save(experience);
    console.log('Repository: Saved experience:', savedExperience);
    return savedExperience;
  }

  async findExperiencesByHumanResourceId(humanResourceId: string): Promise<ExperienceEntity[]> {
    console.log('Repository: Finding experiences for human resource:', humanResourceId);
    
    // Query by hr_id column (the actual foreign key)
    const result = await this.experienceRepository.find({
      where: { hr_id: humanResourceId },
      relations: ['humanResource'],
      order: { start_date: 'DESC' },
    });
    console.log('Repository: Found experiences:', result.length, result);
    
    return result;
  }

  async findExperienceById(id: string): Promise<ExperienceEntity | null> {
    return this.experienceRepository.findOne({
      where: { id },
      relations: ['humanResource'],
    });
  }

  async updateExperience(id: string, experienceData: Partial<ExperienceEntity>): Promise<ExperienceEntity> {
    await this.experienceRepository.update(id, experienceData);
    const updated = await this.findExperienceById(id);
    if (!updated) {
      throw new Error('Experience not found after update');
    }
    return updated;
  }

  async deleteExperience(id: string): Promise<void> {
    await this.experienceRepository.delete(id);
  }

  // Translation methods
  async createTranslation(translationData: Partial<HumanResourceTranslationEntity>): Promise<HumanResourceTranslationEntity> {
    const translation = this.translationRepository.create(translationData);
    return this.translationRepository.save(translation);
  }

  async findTranslationsByHumanResourceId(humanResourceId: string): Promise<HumanResourceTranslationEntity[]> {
    return this.translationRepository.find({
      where: { human_resource_id: humanResourceId },
      relations: ['language'],
    });
  }

  async updateTranslation(id: string, translationData: Partial<HumanResourceTranslationEntity>): Promise<HumanResourceTranslationEntity> {
    await this.translationRepository.update(id, translationData);
    const updated = await this.translationRepository.findOne({
      where: { id },
      relations: ['language'],
    });
    if (!updated) {
      throw new Error('Translation not found after update');
    }
    return updated;
  }

  async deleteTranslation(id: string): Promise<void> {
    await this.translationRepository.delete(id);
  }

  // Certificate methods
  async createCertificate(certificateData: Partial<CertificateEntity>): Promise<CertificateEntity> {
    const certificate = this.certificateRepository.create(certificateData);
    return this.certificateRepository.save(certificate);
  }

  async findCertificatesByHumanResourceId(humanResourceId: string): Promise<CertificateEntity[]> {
    return this.certificateRepository.find({
      where: { humanResource: { id: humanResourceId } },
      order: { issue_date: 'DESC' },
    });
  }

  async findCertificateById(id: string): Promise<CertificateEntity | null> {
    return this.certificateRepository.findOne({
      where: { id },
      relations: ['humanResource'],
    });
  }

  async updateCertificate(id: string, certificateData: Partial<CertificateEntity>): Promise<CertificateEntity> {
    await this.certificateRepository.update(id, certificateData);
    const updated = await this.findCertificateById(id);
    if (!updated) {
      throw new Error('Certificate not found after update');
    }
    return updated;
  }

  async deleteCertificate(id: string): Promise<void> {
    await this.certificateRepository.delete(id);
  }
}
