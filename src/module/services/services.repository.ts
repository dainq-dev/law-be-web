import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity, ServiceTranslationEntity } from '@shared/entities/service.entity';
import { PaginationOptions } from '@shared/utilities/pagination';

@Injectable()
export class ServicesRepository {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
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
      .leftJoinAndSelect('service.translations', 'translations', 'translations.service_id = service.id')
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
    const result = data.map((item, index) => {
      const { translations, __v, deleted_at, features, requirements, ...rest } = item;
      const translationTransfer:any = translations.map(translation => ({
        ...rest,
        ...translation,
        legal_fields: translation.legal_fields ? JSON.stringify(translation.legal_fields?.split(',')) : [],
        group_index: index,
      }));
      return [...translationTransfer, {...rest, language_code: 'vi', group_index: index}];
    }).flat();
    return {
      data: result,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<ServiceEntity | null> {
    return this.serviceRepository.findOne({
      where: { id },
      relations: ['translations'],
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

  // Removed featured and tags methods as they are no longer part of the model

  // Translation methods
  async createTranslation(translationData: Partial<ServiceTranslationEntity>): Promise<ServiceTranslationEntity> {
    const translation = this.translationRepository.create(translationData);
    return this.translationRepository.save(translation);
  }

  async findTranslationsByServiceId(serviceId: string): Promise<ServiceTranslationEntity[]> {
    return this.translationRepository.find({
      where: { service_id: serviceId },
    });
  }

  async deleteTranslationsByServiceId(serviceId: string): Promise<void> {
    await this.translationRepository.delete({ service_id: serviceId });
  }

  async updateTranslation(id: string, translationData: Partial<ServiceTranslationEntity>): Promise<ServiceTranslationEntity> {
    await this.translationRepository.update(id, translationData);
    const updated = await this.translationRepository.findOne({
      where: { id },
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
      .leftJoinAndSelect('service.translations', 'translations', 'translations.service_id = service.id')
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
