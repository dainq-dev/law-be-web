import { v4 as uuidv4 } from 'uuid';

/**
 * Utility for generating and managing request IDs
 */
export class RequestIdUtil {
  private static readonly REQUEST_ID_HEADER = 'x-request-id';

  /**
   * Generate a new request ID
   */
  static generate(): string {
    return uuidv4();
  }

  /**
   * Extract request ID from headers or generate new one
   */
  static getOrCreate(request: any): string {
    const existingId = request.headers[this.REQUEST_ID_HEADER] || 
                      request.headers['x-correlation-id'] ||
                      request.headers['x-trace-id'];
    
    return existingId || this.generate();
  }

  /**
   * Set request ID in response headers
   */
  static setResponseHeader(response: any, requestId: string): void {
    response.setHeader(this.REQUEST_ID_HEADER, requestId);
  }

  /**
   * Get request ID header name
   */
  static getHeaderName(): string {
    return this.REQUEST_ID_HEADER;
  }
}
