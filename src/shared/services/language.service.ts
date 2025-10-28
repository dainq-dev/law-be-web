import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LanguageEntity } from '../entities/language.entity';
import { CreateLanguageDto, UpdateLanguageDto, LanguageResponseDto } from '../dto/language.dto';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(LanguageEntity)
    private readonly languageRepository: Repository<LanguageEntity>,
  ) {}

  async create(createLanguageDto: CreateLanguageDto): Promise<LanguageResponseDto> {
    const language = this.languageRepository.create(createLanguageDto);
    const savedLanguage = await this.languageRepository.save(language);
    return this.toResponseDto(savedLanguage);
  }

  async findAll(): Promise<LanguageResponseDto[]> {
    const languages = await this.languageRepository.find({
      where: { is_active: true },
      order: { sort_order: 'ASC' },
    });
    return languages.map(language => this.toResponseDto(language));
  }

  async findOne(id: string): Promise<LanguageResponseDto> {
    const language = await this.languageRepository.findOne({
      where: { id, is_active: true },
    });

    if (!language) {
      throw new NotFoundException(`Language with ID ${id} not found`);
    }

    return this.toResponseDto(language);
  }

  async findByCode(code: string): Promise<LanguageResponseDto> {
    const language = await this.languageRepository.findOne({
      where: { code, is_active: true },
    });

    if (!language) {
      throw new NotFoundException(`Language with code ${code} not found`);
    }

    return this.toResponseDto(language);
  }

  async getDefaultLanguage(): Promise<LanguageResponseDto> {
    const language = await this.languageRepository.findOne({
      where: { is_default: true, is_active: true },
    });

    if (!language) {
      // Fallback to first active language
      const fallbackLanguage = await this.languageRepository.findOne({
        where: { is_active: true },
        order: { sort_order: 'ASC' },
      });

      if (!fallbackLanguage) {
        throw new NotFoundException('No active language found');
      }

      return this.toResponseDto(fallbackLanguage);
    }

    return this.toResponseDto(language);
  }

  async update(id: string, updateLanguageDto: UpdateLanguageDto): Promise<LanguageResponseDto> {
    const language = await this.languageRepository.findOne({
      where: { id, is_active: true },
    });

    if (!language) {
      throw new NotFoundException(`Language with ID ${id} not found`);
    }

    // If setting as default, unset other defaults
    if (updateLanguageDto.is_default) {
      await this.languageRepository.update(
        { is_default: true },
        { is_default: false }
      );
    }

    Object.assign(language, updateLanguageDto);
    const savedLanguage = await this.languageRepository.save(language);
    return this.toResponseDto(savedLanguage);
  }

  async remove(id: string): Promise<void> {
    const language = await this.languageRepository.findOne({
      where: { id, is_active: true },
    });

    if (!language) {
      throw new NotFoundException(`Language with ID ${id} not found`);
    }

    // Soft delete
    await this.languageRepository.update(id, { is_active: false });
  }

  async getLanguageIdByCode(code: string): Promise<string> {
    const language = await this.findByCode(code);
    return language.id;
  }

  private toResponseDto(language: LanguageEntity): LanguageResponseDto {
    return {
      id: language.id,
      code: language.code,
      name: language.name,
      native_name: language.native_name,
      flag: language.flag,
      is_active: language.is_active,
      is_default: language.is_default,
      sort_order: language.sort_order,
      created_at: language.created_at || new Date(),
      updated_at: language.updated_at || new Date(),
    };
  }
}
