import { Injectable } from '@nestjs/common';
import { LanguageService } from './language.service';

@Injectable()
export class TranslationService {
  constructor(private readonly languageService: LanguageService) {}

  /**
   * Get language ID from language code or ID
   */
  async getLanguageId(languageCodeOrId?: string): Promise<string | null> {
    if (!languageCodeOrId) {
      const defaultLanguage = await this.languageService.getDefaultLanguage();
      return defaultLanguage.id;
    }

    // Check if it's a UUID (language ID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(languageCodeOrId)) {
      try {
        const language = await this.languageService.findOne(languageCodeOrId);
        return language.id;
      } catch {
        return null;
      }
    }

    // Try to find by code
    try {
      const language = await this.languageService.findByCode(languageCodeOrId);
      return language.id;
    } catch {
      return null;
    }
  }

  /**
   * Get translation for a specific language
   */
  getTranslation<T extends { translations?: any[] }>(
    entity: T,
    languageId: string,
    fallbackToDefault: boolean = true
  ): any | null {
    if (!entity.translations || entity.translations.length === 0) {
      return null;
    }

    // Find translation for the specific language
    const translation = entity.translations.find(t => t.language_id === languageId);
    if (translation) {
      return translation;
    }

    // If fallback is enabled, try to find default language translation
    if (fallbackToDefault) {
      const defaultTranslation = entity.translations.find(t => t.language?.is_default);
      if (defaultTranslation) {
        return defaultTranslation;
      }

      // If no default found, return the first available translation
      return entity.translations[0];
    }

    return null;
  }

  /**
   * Merge base entity with translation data
   */
  mergeWithTranslation<T extends Record<string, any>>(
    baseEntity: T,
    translation: any
  ): T {
    if (!translation) {
      return baseEntity;
    }

    const merged = { ...baseEntity };

    // Override translatable fields with translation data
    Object.keys(translation).forEach(key => {
      if (key !== 'id' && key !== 'language_id' && key !== 'language' && 
          key !== '__v' && key !== 'is_active' && translation[key] !== null && translation[key] !== undefined) {
        (merged as any)[key] = translation[key];
      }
    });

    return merged;
  }

  /**
   * Get all available translations for an entity
   */
  getAllTranslations<T extends { translations?: any[] }>(entity: T): any[] {
    return entity.translations || [];
  }

  /**
   * Check if entity has translation for specific language
   */
  hasTranslation<T extends { translations?: any[] }>(
    entity: T,
    languageId: string
  ): boolean {
    if (!entity.translations || entity.translations.length === 0) {
      return false;
    }

    return entity.translations.some(t => t.language_id === languageId);
  }
}
