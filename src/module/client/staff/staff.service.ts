import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PublicStaffRepository } from './staff.repository';
import { CommonRepository } from '../common/common.repository';

@Injectable()
export class PublicStaffService {
  constructor(
    private readonly publicBlogsRepository: PublicStaffRepository,
    private readonly commonRepository: CommonRepository,
  ) {}

  /**
   * Check website enabled trước khi thực hiện các thao tác
   */
  private async checkWebsiteEnabled(): Promise<void> {
    const isEnabled = await this.commonRepository.isWebsiteEnabled();
    if (!isEnabled) {
      throw new ServiceUnavailableException(
        'Website is currently disabled. Please contact the administrator.',
      );
    }
  }

  async findAll() {
    await this.checkWebsiteEnabled();
    return this.publicBlogsRepository.findAll();
  }

  async findBySlug(slug: string) {
    await this.checkWebsiteEnabled();
    return this.publicBlogsRepository.findOne(slug);
  }

}
