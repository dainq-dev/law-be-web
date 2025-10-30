import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ServicesRepository } from './services.repository';
import { PaginationOptions } from '@shared/utilities/pagination';
import { plainToClass } from 'class-transformer';
import {
  CreateServiceDto,
  UpdateServiceDto,
  ServiceResponseDto,
} from './dto';
import { ServiceEntity } from '@shared/entities';

@Injectable()
export class ServicesService {
  constructor(
    private readonly servicesRepository: ServicesRepository,
  ) {}

  // Service methods
  async create(createServiceDto: CreateServiceDto): Promise<ServiceResponseDto> {
    // Convert legal_fields arrays to JSON strings
    const serviceData: any = {
      ...createServiceDto,
      legal_fields_vi: createServiceDto.legal_fields_vi ? JSON.stringify(createServiceDto.legal_fields_vi) : null,
      legal_fields_en: createServiceDto.legal_fields_en ? JSON.stringify(createServiceDto.legal_fields_en) : null,
      legal_fields_zh: createServiceDto.legal_fields_zh ? JSON.stringify(createServiceDto.legal_fields_zh) : null,
      is_active: createServiceDto.is_active ?? true,
    };
    
    const service = await this.servicesRepository.create(serviceData);
    return this.toServiceResponseDto(service);
  }

  async findAll(options: PaginationOptions & { search?: string; }): Promise<{
    data: ServiceResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const validatedOptions = {
      page: Math.max(1, options.page || 1),
      limit: Math.min(100, Math.max(1, options.limit || 10)),
      search: options.search,
    };

    const result = await this.servicesRepository.findAll(validatedOptions);

    return {
      ...result,
      data: result.data.map(service => this.toServiceResponseDto(service)),
    };
  }

  async findOne(id: string): Promise<ServiceResponseDto> {
    const service = await this.servicesRepository.findById(id);
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return this.toServiceResponseDto(service);
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<ServiceResponseDto> {
    const service = await this.servicesRepository.findById(id);
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Convert legal_fields arrays to JSON strings if provided and sanitize payload
    const updateData: any = { ...updateServiceDto };
    if (updateServiceDto.legal_fields_vi !== undefined) {
      updateData.legal_fields_vi = updateServiceDto.legal_fields_vi ? JSON.stringify(updateServiceDto.legal_fields_vi) : null;
    }
    if (updateServiceDto.legal_fields_en !== undefined) {
      updateData.legal_fields_en = updateServiceDto.legal_fields_en ? JSON.stringify(updateServiceDto.legal_fields_en) : null;
    }
    if (updateServiceDto.legal_fields_zh !== undefined) {
      updateData.legal_fields_zh = updateServiceDto.legal_fields_zh ? JSON.stringify(updateServiceDto.legal_fields_zh) : null;
    }
    // Remove unknown fields that are not columns in ServiceEntity to avoid TypeORM errors
    const allowedKeys: (keyof ServiceEntity)[] = [
      'name_vi', 'name_en', 'name_zh',
      'short_description_vi', 'short_description_en', 'short_description_zh',
      'description_vi', 'description_en', 'description_zh',
      'legal_fields_vi', 'legal_fields_en', 'legal_fields_zh',
      'image_url', 'is_active', 'is_featured'
    ];
    const sanitizedUpdate: Partial<ServiceEntity> = {};
    for (const key of allowedKeys) {
      if (Object.prototype.hasOwnProperty.call(updateData, key)) {
        sanitizedUpdate[key] = updateData[key];
      }
    }
    
    const updatedService = await this.servicesRepository.update(id, sanitizedUpdate);
    return this.toServiceResponseDto(updatedService);
  }

  async remove(id: string): Promise<{ message: string }> {
    const service = await this.servicesRepository.findById(id);
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    await this.servicesRepository.delete(id);
    return { message: 'Service deleted successfully' };
  }

  async findFeatured(): Promise<ServiceResponseDto[]> {
    const featuredServices = await this.servicesRepository.findFeatured();
    return featuredServices.map(service => this.toServiceResponseDto(service));
  }

  async findByTags(tags: string[]): Promise<ServiceResponseDto[]> {
    return [];
  }

  // Process step APIs removed as not part of the model

  // Translation methods removed - translations are now stored as columns in the main entity

  private toServiceResponseDto(service: ServiceEntity): ServiceResponseDto {
    // Parse legal_fields from JSON strings to arrays for each language
    const response = plainToClass(ServiceResponseDto, service, {
      excludeExtraneousValues: true,
    });
    
    // Legal fields are stored as JSON strings in entity, but we return them as-is (strings)
    // If client needs arrays, they can parse them
    // response already has legal_fields_vi, legal_fields_en, legal_fields_zh as strings
    
    return response;
  }

}
