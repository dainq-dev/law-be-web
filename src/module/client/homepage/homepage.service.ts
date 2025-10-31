import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import {
  HumanResourceEntity,
  ServiceEntity,
  BlogEntity,
  WebConfigEntity,
} from '@shared/entities';
import { HomepageStatsDto, HomepageDataDto, CompanyInfoDto } from './dto';

@Injectable()
export class HomepageService {
  constructor(
    @InjectRepository(HumanResourceEntity)
    private readonly humanResourceRepository: Repository<HumanResourceEntity>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
    @InjectRepository(WebConfigEntity)
    private readonly webConfigRepository: Repository<WebConfigEntity>,
  ) {}

  async getHomepageData(): Promise<any> {
    const [
      staff,
      services,
      blogs,
      config,
    ] = await Promise.all([
      this.getFeaturedHumanResources(),
      this.getFeaturedServices(),
      this.getRecentBlogPosts(),
      this.getConfig(),
    ]);

    return {
      staff,
      services,
      blogs,
      config,
    };
  }

  private async getFeaturedHumanResources(): Promise<any[]> {
    const humanResources = await this.humanResourceRepository.find({
      where: { is_active: true, is_featured: true },
      relations: ['educations', 'experiences', 'certificates'],
      take: 6,
      order: { created_at: 'DESC' },
    });

    return humanResources.map(hr => ({
      id: hr.id,
      full_name_vi: hr.full_name_vi,
      full_name_en: hr.full_name_en,
      full_name_zh: hr.full_name_zh,
      position_vi: hr.position_vi,
      position_en: hr.position_en,
      position_zh: hr.position_zh,
      avatar_url: hr.avatar_url,
      email: hr.email,
      phone_number: hr.phone_number,
      about_vi: hr.about_vi,
      about_en: hr.about_en,
      about_zh: hr.about_zh,
      location_vi: hr.location_vi,
      location_en: hr.location_en,
      location_zh: hr.location_zh,
    }));
  }

  private async getFeaturedServices(): Promise<any[]> {
    const services = await this.serviceRepository.find({
      where: { is_active: true, is_featured: true },
      take: 6,
      order: { created_at: 'DESC' },
    });

    return services.map(service => ({
      id: service.id,
      name_vi: service.name_vi,
      name_en: service.name_en,
      name_zh: service.name_zh,
      short_description_vi: service.short_description_vi,
      short_description_en: service.short_description_en,
      short_description_zh: service.short_description_zh,
      description_vi: service.description_vi,
      description_en: service.description_en,
      description_zh: service.description_zh,
      image_url: service.image_url,
      legal_fields_vi: service.legal_fields_vi ? JSON.parse(service.legal_fields_vi) : [],
      legal_fields_en: service.legal_fields_en ? JSON.parse(service.legal_fields_en) : [],
      legal_fields_zh: service.legal_fields_zh ? JSON.parse(service.legal_fields_zh) : [],
    }));
  }

  private async getRecentBlogPosts(): Promise<any[]> {
    const blogs = await this.blogRepository.find({
      where: { 
        status: 'published',
      },
      take: 6,
      order: { published_at: 'DESC' },
    });

    return blogs.map(blog => ({
      id: blog.id,
      title_vi: blog.title_vi,
      title_en: blog.title_en,
      title_zh: blog.title_zh,
      excerpt_vi: blog.excerpt_vi,
      excerpt_en: blog.excerpt_en,
      excerpt_zh: blog.excerpt_zh,
      description_vi: blog.description_vi,
      description_en: blog.description_en,
      description_zh: blog.description_zh,
      slug: blog.slug,
      published_at: blog.published_at,
      status: blog.status,
      featured_image_url: blog.featured_image_url,
      featured_image_alt: blog.featured_image_alt,
      is_featured: blog.is_featured,
      like_count: blog.like_count,
    }));
  }
  private async getConfig(): Promise<any[]> {
    const configs = await this.webConfigRepository.find({
      where: { 
        is_active: true,
        screen: 'homepage',
      },
      select: ['key', 'value'],
    });

    return configs;
  }

  async getHomepageStats(): Promise<HomepageStatsDto> {
    const [totalHumanResources, totalServices, totalBlogPosts] = await Promise.all([
      this.humanResourceRepository.count({ where: { is_active: true } }),
      this.serviceRepository.count({ where: { is_active: true } }),
      this.blogRepository.count(),
    ]);

    // Get success_rate and client_satisfaction from web config
    const [successRateConfig, clientSatisfactionConfig] = await Promise.all([
      this.webConfigRepository.findOne({
        where: { key: 'success_rate' },
      }),
      this.webConfigRepository.findOne({
        where: { key: 'client_satisfaction' },
      }),
    ]);

    return {
      total_human_resources: totalHumanResources,
      total_services: totalServices,
      total_blog_posts: totalBlogPosts,
      success_rate: successRateConfig ? parseFloat(successRateConfig.value) : 95,
      client_satisfaction: clientSatisfactionConfig
        ? parseFloat(clientSatisfactionConfig.value)
        : 98,
    };
  }

  async getConfigByScreen(key: string): Promise<any> {
    const config = await this.webConfigRepository.find({
      where: { screen: key},
      select: ['key', 'value'],
    });
    return config;
  }


  async getServices(): Promise<any> {
    const services = await this.serviceRepository.find({
      where: { is_active: true, is_featured: true },
      select: [
        'id',
        'name_vi',
        'name_en',
        'name_zh',
        'short_description_vi',
        'short_description_en',
        'short_description_zh',
        'description_vi',
        'description_en',
        'description_zh',
        'image_url',
        'legal_fields_vi',
        'legal_fields_en',
        'legal_fields_zh',
      ],
      order: { created_at: 'DESC' },
    });
    return services;
  }
}

