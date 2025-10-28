import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebConfigEntity } from '@shared/entities';
import { PaginationOptions } from '@shared/utilities/pagination';

@Injectable()
export class WebConfigRepository {
  constructor(
    @InjectRepository(WebConfigEntity)
    private readonly webConfigRepository: Repository<WebConfigEntity>,
  ) {}

  async create(configData: Partial<WebConfigEntity>): Promise<WebConfigEntity> {
    const config = this.webConfigRepository.create(configData);
    return this.webConfigRepository.save(config);
  }

  async findById(id: string): Promise<WebConfigEntity | null> {
    return this.webConfigRepository.findOne({ where: { id } });
  }

  async findByKey(key: string, screen?: string): Promise<WebConfigEntity | null> {
    const where: any = { key };
    if (screen) {
      where.screen = screen;
    }
    return this.webConfigRepository.findOne({ where });
  }

  async findAll(
    options: PaginationOptions & { search?: string; screen?: string },
  ): Promise<{
    data: WebConfigEntity[];
    total: number;
  }> {
    const page = options.page || 1;
    const limit = options.limit || 10;

    const queryBuilder = this.webConfigRepository
      .createQueryBuilder('config')
      .orderBy('config.key', 'ASC');

    if (options.search) {
      queryBuilder.andWhere('config.key ILIKE :search', {
        search: `%${options.search}%`,
      });
    }

    if (options.screen) {
      queryBuilder.andWhere('config.screen = :screen', {
        screen: options.screen,
      });
    }

    queryBuilder
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  async findAllForAdmin(screen?: string): Promise<WebConfigEntity[]> {
    const queryBuilder = this.webConfigRepository
      .createQueryBuilder('config')
      .orderBy('config.key', 'ASC');

    if (screen) {
      queryBuilder.andWhere('config.screen = :screen', {
        screen: screen,
      });
    }

    return queryBuilder.getMany();
  }

  async update(
    id: string,
    configData: Partial<WebConfigEntity>,
  ): Promise<WebConfigEntity | null> {
    await this.webConfigRepository.update(id, configData);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.webConfigRepository.softDelete(id);
  }
}

