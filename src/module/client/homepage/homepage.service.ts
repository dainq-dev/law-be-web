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
      relations: ['educations', 'experiences', 'certificates', 'translations'],
      take: 6,
      order: { created_at: 'DESC' },
    });

    return humanResources.map(hr => ({
      id: hr.id,
      full_name: hr.full_name,
      position: hr.position,
      avatar_url: hr.avatar_url,
      email: hr.email,
      phone_number: hr.phone_number,
      about: hr.about,
      location: hr.location,
      translations: hr.translations,
    }));
  }

  private async getFeaturedServices(): Promise<any[]> {
    const services = await this.serviceRepository.find({
      where: { is_active: true, is_featured: true },
      relations: ['processSteps', 'translations'],
      take: 6,
      order: { created_at: 'DESC' },
    });

    return services.map(service => ({
      id: service.id,
      name: service.name,
      short_description: service.short_description,
      description: service.description,
      image_url: service.image_url,
      legal_fields: service.legal_fields ? JSON.parse(service.legal_fields) : [],
      translations: service.translations,
    }));
  }

  private async getRecentBlogPosts(): Promise<any[]> {
    const blogs = await this.blogRepository.find({
      where: { 
        is_active: true,
        status: 'published',
      },
      relations: ['translations'],
      take: 6,
      order: { published_at: 'DESC' },
    });

    return blogs.map(blog => ({
      id: blog.id,
      title: blog.title,
      excerpt: blog.excerpt,
      slug: blog.slug,
      published_at: blog.published_at,
      status: blog.status,
      author: blog.author,
      translations: blog.translations,
      featured_image_url: blog.featured_image_url,
      featured_image_alt: blog.featured_image_alt,
      meta_title: blog.meta_title,
      meta_description: blog.meta_description,
      og_image_url: blog.og_image_url,
      social_media: blog.social_media,
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

    console.log("🚀 ~ HomepageService ~ getHomepageStats ~ totalBlogPosts:", totalBlogPosts)
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
      relations: ['processSteps', 'translations'],
      select: ['id', 'name', 'short_description', 'description', 'image_url', 'legal_fields'],
      order: { created_at: 'DESC' },
    });
    return services;
  }
}

