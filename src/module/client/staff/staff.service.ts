import { Injectable } from '@nestjs/common';
import { PublicStaffRepository } from './staff.repository';

@Injectable()
export class PublicStaffService {
  constructor(private readonly publicBlogsRepository: PublicStaffRepository) {}

  async findAll() {
    return this.publicBlogsRepository.findAll();
  }

  async findBySlug(slug: string) {
    return this.publicBlogsRepository.findOne(slug);
  }

}
