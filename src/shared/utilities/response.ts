export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export class ResponseHelper {
  static success<T>(data: T, message: string = 'Success'): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(message: string, error?: string): ApiResponse {
    return {
      success: false,
      message,
      error,
    };
  }

  static paginated<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    message: string = 'Success',
  ): ApiResponse<T[]> {
    return {
      success: true,
      message,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
