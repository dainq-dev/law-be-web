export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class PaginationHelper {
  static validatePaginationOptions(options: PaginationOptions): Required<PaginationOptions> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 10));
    
    return { page, limit };
  }

  static calculateSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  static calculateTotalPages(total: number, limit: number): number {
    return Math.ceil(total / limit);
  }

  static getPageAndLimit(options: PaginationOptions): { page: number; limit: number } {
    return {
      page: Math.max(1, options.page || 1),
      limit: Math.min(100, Math.max(1, options.limit || 10)),
    };
  }
}