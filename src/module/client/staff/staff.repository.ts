import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { HumanResourceEntity } from '@shared/entities';

@Injectable()
export class PublicStaffRepository {
  constructor(
    @InjectRepository(HumanResourceEntity)
    private readonly staffRepository: Repository<HumanResourceEntity>,
  ) {}

  async findAll() {
    const queryBuilder = this.createBaseQuery();
    queryBuilder.orderBy('human_resources.created_at', 'DESC');
    const staffs = await queryBuilder.getMany();
    return staffs;
  }

  async findOne(id: string) {
    const queryBuilder = this.staffRepository.createQueryBuilder('human_resources');
    queryBuilder.where('human_resources.id = :id', { id });
    const staff = await queryBuilder
    .leftJoinAndSelect('human_resources.educations', 'educations')
    .leftJoinAndSelect('human_resources.experiences', 'experiences')
    .leftJoinAndSelect('human_resources.certificates', 'certificates')
    .getOne();
    return staff ?? null;
  }


  private createBaseQuery(): SelectQueryBuilder<HumanResourceEntity> {
    return this.staffRepository
      .createQueryBuilder('human_resources')
      .select([
        'human_resources.id',
        'human_resources.full_name_vi',
        'human_resources.full_name_en',
        'human_resources.full_name_zh',
        'human_resources.position_vi',
        'human_resources.position_en',
        'human_resources.position_zh',
        'human_resources.email',
        'human_resources.phone_number',
        'human_resources.about_vi',
        'human_resources.about_en',
        'human_resources.about_zh',
        'human_resources.avatar_url',
        'human_resources.location_vi',
        'human_resources.location_en',
        'human_resources.location_zh',
        'human_resources.address_vi',
        'human_resources.address_en',
        'human_resources.address_zh',
        'human_resources.is_active',
        'human_resources.is_featured',
      ]);
  }
}
