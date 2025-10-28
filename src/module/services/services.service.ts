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
    const { translations, legal_fields, ...serviceData } = createServiceDto;
    
    // Convert legal_fields array to JSON string
    const serviceDataWithLegalFields = {
      ...serviceData,
      sort_order: createServiceDto.sort_order || 0,
      legal_fields: legal_fields ? JSON.stringify(legal_fields) : undefined,
    };
    
    const service = await this.servicesRepository.create(serviceDataWithLegalFields);

    // Create translations if provided
    if (translations && translations.length > 0) {
      await this.createTranslations(service.id, translations);
    }

    return this.toServiceResponseDto(service);
  }

  async findAll(options: PaginationOptions & { search?: string; }): Promise<any> {
    const validatedOptions = {
      page: Math.max(1, options.page || 1),
      limit: Math.min(100, Math.max(1, options.limit || 10)),
      search: options.search,
    };

    const result = await this.servicesRepository.findAll(validatedOptions);
    console.log("🚀 ~ ServicesService ~ findAll ~ result:", result)

    return result
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

    const { translations, legal_fields, ...serviceData } = updateServiceDto;
    
    // Convert legal_fields array to JSON string if provided
    const serviceDataWithLegalFields = {
      ...serviceData,
      ...(legal_fields && { legal_fields: JSON.stringify(legal_fields) }),
    };
    
    const updatedService = await this.servicesRepository.update(id, serviceDataWithLegalFields);
    
    // Update translations if provided
    if (translations && translations.length > 0) {
      // Delete existing translations and create new ones
      await this.servicesRepository.deleteTranslationsByServiceId(id);
      await this.createTranslations(id, translations);
    }
    
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
    return [];
  }

  async findByTags(tags: string[]): Promise<ServiceResponseDto[]> {
    return [];
  }

  // Process step APIs removed as not part of the model

  private async createTranslations(serviceId: string, translations: any[]): Promise<void> {
    for (const translation of translations) {
      await this.servicesRepository.createTranslation({
        ...translation,
        service_id: serviceId,
      });
    }
  }

  // Translation methods
  async createTranslation(serviceId: string, translationData: any): Promise<any> {
    const service = await this.servicesRepository.findById(serviceId);
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Check if translation already exists for this language
    const existingTranslation = await this.servicesRepository.findTranslationByServiceAndLanguage(
      serviceId, 
      translationData.language_code
    );
    
    if (existingTranslation) {
      throw new ConflictException('Translation already exists for this language');
    }

    const translation = await this.servicesRepository.createTranslation({
      ...translationData,
      service_id: serviceId,
    });

    return translation;
  }

  async getTranslations(serviceId: string): Promise<any[]> {
    const service = await this.servicesRepository.findById(serviceId);
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return this.servicesRepository.findTranslationsByServiceId(serviceId);
  }

  async getTranslation(serviceId: string, languageCode: string): Promise<any> {
    const translation = await this.servicesRepository.findTranslationByServiceAndLanguage(
      serviceId, 
      languageCode
    );
    
    if (!translation) {
      throw new NotFoundException('Translation not found');
    }

    return translation;
  }

  async updateTranslation(serviceId: string, languageCode: string, translationData: any): Promise<any> {
    const translation = await this.servicesRepository.findTranslationByServiceAndLanguage(
      serviceId, 
      languageCode
    );
    
    if (!translation) {
      throw new NotFoundException('Translation not found');
    }

    return this.servicesRepository.updateTranslation(translation.id, translationData);
  }

  async deleteTranslation(serviceId: string, languageCode: string): Promise<{ message: string }> {
    const translation = await this.servicesRepository.findTranslationByServiceAndLanguage(
      serviceId, 
      languageCode
    );
    
    if (!translation) {
      throw new NotFoundException('Translation not found');
    }

    await this.servicesRepository.deleteTranslation(translation.id);
    return { message: 'Translation deleted successfully' };
  }

  async getServicesByLanguage(languageCode: string, options: PaginationOptions & { search?: string; }): Promise<{
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

    const result = await this.servicesRepository.findAllWithTranslations(languageCode, validatedOptions);

    return {
      ...result,
      data: result.data.map(service => this.toServiceResponseDtoWithTranslations(service)),
    };
  }

  private toServiceResponseDto(service: ServiceEntity): ServiceResponseDto {
    const response = plainToClass(ServiceResponseDto, service, {
      excludeExtraneousValues: true,
    });
    
    // Parse legal_fields from JSON string to array
    if (service.legal_fields) {
      try {
        response.legal_fields = JSON.parse(service.legal_fields);
      } catch (error) {
        response.legal_fields = [];
      }
    } else {
      response.legal_fields = [];
    }
    
    return response;
  }

  private toServiceResponseDtoWithTranslations(service: ServiceEntity): ServiceResponseDto {
    const response = this.toServiceResponseDto(service);
    
    // Add translations if available
    if (service.translations && service.translations.length > 0) {
      (response as any).translations = service.translations;
      (response as any).available_languages = service.translations.map(t => t.language_code);
    }
    
    return response;
  }
}
