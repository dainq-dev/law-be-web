import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { WebConfigRepository } from './web-config.repository';
import { PaginationOptions } from '@shared/utilities/pagination';
import { plainToClass } from 'class-transformer';
import {
  CreateWebConfigDto,
  UpdateWebConfigDto,
  WebConfigResponseDto,
} from './dto';
import { WebConfigEntity } from '@shared/entities';

@Injectable()
export class WebConfigService {
  constructor(private readonly webConfigRepository: WebConfigRepository) {}

  async create(createWebConfigDto: CreateWebConfigDto): Promise<WebConfigResponseDto> {
    const { key, screen } = createWebConfigDto;

    // Check if config with same key and screen already exists
    const existingConfig = await this.webConfigRepository.findByKey(key, screen);
    if (existingConfig) {
      throw new ConflictException('Config with this key and screen already exists');
    }

    const config = await this.webConfigRepository.create(createWebConfigDto);
    return this.toWebConfigResponseDto(config);
  }

  async findAll(
    options: PaginationOptions & { search?: string; screen?: string },
  ): Promise<{
    data: WebConfigResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const validatedOptions = {
      page: Math.max(1, options.page || 1),
      limit: Math.min(100, Math.max(1, options.limit || 10)),
      search: options.search,
      screen: options.screen,
    };

    const result = await this.webConfigRepository.findAll(validatedOptions);

    return {
      data: result.data.map((config) => this.toWebConfigResponseDto(config)),
      total: result.total,
      page: validatedOptions.page,
      limit: validatedOptions.limit,
      totalPages: Math.ceil(result.total / validatedOptions.limit),
    };
  }

  async findAllForAdmin(screen?: string): Promise<WebConfigResponseDto[]> {
    const configs = await this.webConfigRepository.findAllForAdmin(screen);
    return configs.map((config) => this.toWebConfigResponseDto(config));
  }

  async findOne(id: string): Promise<WebConfigResponseDto> {
    const config = await this.webConfigRepository.findById(id);
    if (!config) {
      throw new NotFoundException('Config not found');
    }
    return this.toWebConfigResponseDto(config);
  }

  async findByKey(key: string, screen?: string): Promise<WebConfigResponseDto> {
    const config = await this.webConfigRepository.findByKey(key, screen);
    if (!config) {
      throw new NotFoundException('Config not found');
    }
    return this.toWebConfigResponseDto(config);
  }

  async update(
    id: string,
    updateWebConfigDto: UpdateWebConfigDto,
  ): Promise<WebConfigResponseDto> {
    const config = await this.webConfigRepository.findById(id);
    if (!config) {
      throw new NotFoundException('Config not found');
    }

    // Check if key is being changed and if it already exists
    if (updateWebConfigDto.key && updateWebConfigDto.key !== config.key) {
      const existingConfig = await this.webConfigRepository.findByKey(
        updateWebConfigDto.key,
        updateWebConfigDto.screen || config.screen,
      );
      if (existingConfig) {
        throw new ConflictException('Config with this key and screen already exists');
      }
    }

    const updatedConfig = await this.webConfigRepository.update(
      id,
      updateWebConfigDto,
    );
    if (!updatedConfig) {
      throw new NotFoundException('Config not found after update');
    }
    return this.toWebConfigResponseDto(updatedConfig);
  }

  async remove(id: string): Promise<{ message: string }> {
    const config = await this.webConfigRepository.findById(id);
    if (!config) {
      throw new NotFoundException('Config not found');
    }

    await this.webConfigRepository.delete(id);
    return { message: 'Config deleted successfully' };
  }

  private toWebConfigResponseDto(config: WebConfigEntity): WebConfigResponseDto {
    return plainToClass(WebConfigResponseDto, config, {
      excludeExtraneousValues: true,
    });
  }
}

