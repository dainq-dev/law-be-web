import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity } from '@shared/entities/service.entity';
import { PaginationOptions } from '@shared/utilities/pagination';

@Injectable()
export class ServicesRepository {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
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
      .skip(skip)
      .take(limit)
      .orderBy('service.created_at', 'DESC');

    if (options.search) {
      queryBuilder.where(
        '(service.name_vi ILIKE :search OR service.name_en ILIKE :search OR service.name_zh ILIKE :search OR service.description_vi ILIKE :search OR service.description_en ILIKE :search OR service.description_zh ILIKE :search OR service.short_description_vi ILIKE :search OR service.short_description_en ILIKE :search OR service.short_description_zh ILIKE :search)',
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
      where: { 
        is_active: true,
        is_featured: true 
      },
      order: { created_at: 'DESC' },
    });
  }
}
