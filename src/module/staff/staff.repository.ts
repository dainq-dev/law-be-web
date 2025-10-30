import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HumanResourceEntity } from '@shared/entities/staff.entity';
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
  ) {}

  // Human Resource methods
  async create(humanResourceData: Partial<HumanResourceEntity>): Promise<HumanResourceEntity> {
    const humanResource = this.humanResourceRepository.create(humanResourceData);
    return this.humanResourceRepository.save(humanResource);
  }

  async findAll(options: PaginationOptions & { search?: string }): Promise<{
    data: HumanResourceEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page, limit, search } = options;
    
    // Ensure page and limit are valid numbers
    const validPage = typeof page === 'number' && !isNaN(page) && page > 0 ? page : 1;
    const validLimit = typeof limit === 'number' && !isNaN(limit) && limit > 0 ? limit : 10;
    
    const skip = (validPage - 1) * validLimit;

    const queryBuilder = this.humanResourceRepository
      .createQueryBuilder('hr')
      .leftJoinAndSelect('hr.educations', 'educations')
      .leftJoinAndSelect('hr.experiences', 'experiences')
      .skip(skip)
      .take(validLimit)
      .orderBy('hr.created_at', 'DESC');

    if (search) {
      queryBuilder.where(
        '(hr.full_name_vi ILIKE :search OR hr.full_name_en ILIKE :search OR hr.full_name_zh ILIKE :search OR hr.position_vi ILIKE :search OR hr.position_en ILIKE :search OR hr.position_zh ILIKE :search OR hr.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Note: company_id removed as it doesn't exist in the entity
    // If needed, should be added to the entity first

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
      relations: ['educations', 'experiences', 'certificates'],
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
      where: { 
        is_active: true,
        is_featured: true 
      },
      relations: ['educations', 'experiences', 'certificates'],
      order: { created_at: 'DESC' },
    });
  }

  // Education methods
  async createEducation(educationData: Record<string, any>): Promise<EducationEntity> {
    const education = this.educationRepository.create(educationData);
    const savedEducation = await this.educationRepository.save(education);
    return savedEducation;
  }

  async findEducationsByHumanResourceId(humanResourceId: string): Promise<EducationEntity[]> {
    
    // Query by staff_id column (the actual foreign key)
    const result = await this.educationRepository.find({
      where: { staff_id: humanResourceId },
      order: { from: 'DESC' },
    });
    console.log('Repository: Found educations:', result.length, result);
    
    return result;
  }

  async findEducationById(id: string): Promise<EducationEntity | null> {
    return this.educationRepository.findOne({
      where: { id },
      relations: ['staff'],
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
  async createExperience(experienceData: Record<string, any>): Promise<ExperienceEntity> {
    const experience = this.experienceRepository.create(experienceData);
    const savedExperience = await this.experienceRepository.save(experience);
    return savedExperience;
  }

  async findExperiencesByHumanResourceId(humanResourceId: string): Promise<ExperienceEntity[]> {
    console.log('Repository: Finding experiences for human resource:', humanResourceId);
    
    // Query by staff_id column (the actual foreign key)
    const result = await this.experienceRepository.find({
      where: { staff_id: humanResourceId },
      order: { start_date: 'DESC' },
    });
    console.log('Repository: Found experiences:', result.length, result);
    
    return result;
  }

  async findExperienceById(id: string): Promise<ExperienceEntity | null> {
    return this.experienceRepository.findOne({
      where: { id },
      relations: ['staff'],
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


  // Certificate methods
  async createCertificate(certificateData: Record<string, any>): Promise<CertificateEntity> {
    const certificate = this.certificateRepository.create(certificateData);
    return this.certificateRepository.save(certificate);
  }

  async findCertificatesByHumanResourceId(humanResourceId: string): Promise<CertificateEntity[]> {
    return this.certificateRepository.find({
      where: { staff_id: humanResourceId },
      relations: ['staff'],
      order: { issue_date: 'DESC' },
    });
  }

  async findCertificateById(id: string): Promise<CertificateEntity | null> {
    return this.certificateRepository.findOne({
      where: { id },
      relations: ['staff'],
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
