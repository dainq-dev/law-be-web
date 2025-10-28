import { ValidationError } from 'class-validator';

export class ValidationHelper {
  static formatValidationErrors(errors: ValidationError[]): string[] {
    const formattedErrors: string[] = [];

    for (const error of errors) {
      if (error.constraints) {
        const errorMessages = Object.values(error.constraints);
        formattedErrors.push(...errorMessages);
      }

      if (error.children && error.children.length > 0) {
        const childErrors = this.formatValidationErrors(error.children);
        formattedErrors.push(...childErrors);
      }
    }

    return formattedErrors;
  }

  static getFirstValidationError(errors: ValidationError[]): string | null {
    const formattedErrors = this.formatValidationErrors(errors);
    return formattedErrors.length > 0 ? formattedErrors[0] : null;
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  static sanitizeString(input: string): string {
    return input.trim().replace(/\s+/g, ' ');
  }

  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
}
