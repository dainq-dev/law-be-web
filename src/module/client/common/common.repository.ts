import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebConfigEntity } from '@shared/entities';

@Injectable()
export class CommonRepository {
  private readonly WEBSITE_ENABLED_KEY = 'website_enabled';

  constructor(
    @InjectRepository(WebConfigEntity)
    private readonly webConfigRepository: Repository<WebConfigEntity>,
  ) {}

  async disableWebsite(): Promise<WebConfigEntity> {
    let webConfig = await this.webConfigRepository.findOne({
      where: { key: this.WEBSITE_ENABLED_KEY },
      order: {
        created_at: 'DESC',
      },
      });

    if (!webConfig) {
      // Tạo mới nếu chưa có
      webConfig = this.webConfigRepository.create({
        key: this.WEBSITE_ENABLED_KEY,
        value: 'false',
      });
    } else {
      // Update value = 'false'
      webConfig.value = 'false';
    }
    return await this.webConfigRepository.save(webConfig);
  }

  async isWebsiteEnabled(): Promise<boolean> {
    const now = new Date();
    const webConfig = await this.webConfigRepository.findOne({
      where: { key: this.WEBSITE_ENABLED_KEY},
      order: {
        created_at: 'DESC',
      },
    });

    if (!webConfig) {
      return true;
    }

    return webConfig?.value === 'true';
  }

  async enableWebsite(): Promise<WebConfigEntity> {
    let webConfig = await this.webConfigRepository.findOne({
      where: { key: this.WEBSITE_ENABLED_KEY },
    });

    if (!webConfig) {
      webConfig = this.webConfigRepository.create({
        key: this.WEBSITE_ENABLED_KEY,
        value: 'true',
        
      });
    } else {
      webConfig.value = 'true';
      await this.webConfigRepository.save(webConfig);
    }

    const result = await this.webConfigRepository.findOne({
      where: { key: this.WEBSITE_ENABLED_KEY },
    });

    if (!result) {
      throw new NotFoundException('Website enabled not found');
    }

    return result;
  }
}
