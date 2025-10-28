import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity, ServiceTranslationEntity } from '@shared/entities/service.entity';
import { ProcessStepEntity } from '@shared/entities/process-step.entity';
import { PaginationOptions } from '@shared/utilities/pagination';

@Injectable()
export class ServicesRepository {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
    @InjectRepository(ProcessStepEntity)
    private readonly processStepRepository: Repository<ProcessStepEntity>,
    @InjectRepository(ServiceTranslationEntity)
    private readonly translationRepository: Repository<ServiceTranslationEntity>,
  ) {}

  // Service methods
  async create(serviceData: Partial<ServiceEntity>): Promise<ServiceEntity> {
    const service = this.serviceRepository.create(serviceData);
    return this.serviceRepository.save(service);
  }

  async findAll(options: PaginationOptions & { search?: string }): Promise<{
    data: ServiceEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.serviceRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.processSteps', 'processSteps')
      .skip(skip)
      .take(limit)
      .orderBy('service.sort_order', 'ASC')
      .addOrderBy('service.created_at', 'DESC');

    if (options.search) {
      queryBuilder.where(
        '(service.name ILIKE :search OR service.description ILIKE :search OR service.short_description ILIKE :search)',
        { search: `%${options.search}%` }
      );
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<ServiceEntity | null> {
    return this.serviceRepository.findOne({
      where: { id },
      relations: ['processSteps', 'translations', 'translations.language'],
    });
  }

  async update(id: string, serviceData: Partial<ServiceEntity>): Promise<ServiceEntity> {
    await this.serviceRepository.update(id, serviceData);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Service not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.serviceRepository.delete(id);
  }

  async findFeatured(): Promise<ServiceEntity[]> {
    return this.serviceRepository.find({
      where: {  is_active: true },
      relations: ['company', 'processSteps'],
      order: { sort_order: 'ASC' },
    });
  }

  async findByTags(tags: string[]): Promise<ServiceEntity[]> {
    return this.serviceRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.company', 'company')
      .leftJoinAndSelect('service.processSteps', 'processSteps')
      .where('service.tags && :tags', { tags })
      .andWhere('service.is_active = :is_active', { is_active: true })
      .orderBy('service.sort_order', 'ASC')
      .getMany();
  }

  // Process Step methods
  async createProcessStep(processStepData: Partial<ProcessStepEntity>): Promise<ProcessStepEntity> {
    const processStep = this.processStepRepository.create(processStepData);
    return this.processStepRepository.save(processStep);
  }

  async findProcessStepsByServiceId(serviceId: string): Promise<ProcessStepEntity[]> {
    return this.processStepRepository.find({
      where: { service: { id: serviceId } },
      order: { step_number: 'ASC' },
    });
  }

  async findProcessStepById(id: string): Promise<ProcessStepEntity | null> {
    return this.processStepRepository.findOne({
      where: { id },
      relations: ['service'],
    });
  }

  async updateProcessStep(id: string, processStepData: Partial<ProcessStepEntity>): Promise<ProcessStepEntity> {
    await this.processStepRepository.update(id, processStepData);
    const updated = await this.findProcessStepById(id);
    if (!updated) {
      throw new Error('Process step not found after update');
    }
    return updated;
  }

  async deleteProcessStep(id: string): Promise<void> {
    await this.processStepRepository.delete(id);
  }

  async reorderProcessSteps(serviceId: string, stepOrders: { id: string; step_order: number }[]): Promise<void> {
    for (const { id, step_order } of stepOrders) {
      await this.processStepRepository.update(id, { step_number: step_order });
    }
  }

  // Translation methods
  async createTranslation(translationData: Partial<ServiceTranslationEntity>): Promise<ServiceTranslationEntity> {
    const translation = this.translationRepository.create(translationData);
    return this.translationRepository.save(translation);
  }

  async findTranslationsByServiceId(serviceId: string): Promise<ServiceTranslationEntity[]> {
    return this.translationRepository.find({
      where: { service_id: serviceId },
      relations: ['language'],
    });
  }

  async deleteTranslationsByServiceId(serviceId: string): Promise<void> {
    await this.translationRepository.delete({ service_id: serviceId });
  }

  async updateTranslation(id: string, translationData: Partial<ServiceTranslationEntity>): Promise<ServiceTranslationEntity> {
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

  async findTranslationByServiceAndLanguage(serviceId: string, languageCode: string): Promise<ServiceTranslationEntity | null> {
    return this.translationRepository.findOne({
      where: { 
        service_id: serviceId,
        language_code: languageCode 
      },
      relations: ['language'],
    });
  }

  async findAllWithTranslations(languageCode: string, options: PaginationOptions & { search?: string }): Promise<{
    data: ServiceEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.serviceRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.processSteps', 'processSteps')
      .leftJoinAndSelect('service.translations', 'translations')
      .leftJoinAndSelect('translations.language', 'language')
      .skip(skip)
      .take(limit)
      .orderBy('service.sort_order', 'ASC')
      .addOrderBy('service.created_at', 'DESC');

    if (options.search) {
      queryBuilder.where(
        '(service.name ILIKE :search OR service.description ILIKE :search OR service.short_description ILIKE :search)',
        { search: `%${options.search}%` }
      );
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
