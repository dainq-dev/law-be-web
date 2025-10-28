import { format, parseISO, isValid, addDays, subDays, startOfDay, endOfDay } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

export class DateHelper {
  static readonly DEFAULT_TIMEZONE = 'Asia/Ho_Chi_Minh';
  static readonly DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';
  static readonly DEFAULT_DATETIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';

  /**
   * Format date to string
   */
  static formatDate(date: Date | string, formatStr: string = this.DEFAULT_DATE_FORMAT): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      throw new Error('Invalid date provided');
    }
    return format(dateObj, formatStr);
  }

  /**
   * Format date with timezone
   */
  static formatDateWithTimezone(
    date: Date | string,
    formatStr: string = this.DEFAULT_DATETIME_FORMAT,
    timezone: string = this.DEFAULT_TIMEZONE,
  ): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      throw new Error('Invalid date provided');
    }
    return formatInTimeZone(dateObj, timezone, formatStr);
  }

  /**
   * Get current date in timezone
   */
  static getCurrentDate(timezone: string = this.DEFAULT_TIMEZONE): Date {
    return new Date();
  }

  /**
   * Add days to date
   */
  static addDays(date: Date | string, days: number): Date {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      throw new Error('Invalid date provided');
    }
    return addDays(dateObj, days);
  }

  /**
   * Subtract days from date
   */
  static subtractDays(date: Date | string, days: number): Date {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      throw new Error('Invalid date provided');
    }
    return subDays(dateObj, days);
  }

  /**
   * Get start of day
   */
  static getStartOfDay(date: Date | string): Date {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      throw new Error('Invalid date provided');
    }
    return startOfDay(dateObj);
  }

  /**
   * Get end of day
   */
  static getEndOfDay(date: Date | string): Date {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      throw new Error('Invalid date provided');
    }
    return endOfDay(dateObj);
  }

  /**
   * Check if date is valid
   */
  static isValidDate(date: any): boolean {
    return isValid(date);
  }

  /**
   * Parse date string to Date object
   */
  static parseDate(dateString: string): Date {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      throw new Error('Invalid date string provided');
    }
    return date;
  }

  /**
   * Get date range for pagination
   */
  static getDateRange(days: number = 30): { startDate: Date; endDate: Date } {
    const endDate = new Date();
    const startDate = subDays(endDate, days);
    return { startDate, endDate };
  }
}