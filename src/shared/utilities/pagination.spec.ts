import { PaginationHelper } from './pagination';

describe('PaginationHelper', () => {
  describe('validatePaginationOptions', () => {
    it('should validate correct pagination options', () => {
      const options = { page: 1, limit: 10 };

      expect(() => PaginationHelper.validatePaginationOptions(options)).not.toThrow();
    });

    it('should throw error for invalid page', () => {
      const options = { page: 0, limit: 10 };

      expect(() => PaginationHelper.validatePaginationOptions(options)).toThrow('Page must be greater than 0');
    });

    it('should throw error for invalid limit', () => {
      const options = { page: 1, limit: 0 };

      expect(() => PaginationHelper.validatePaginationOptions(options)).toThrow('Limit must be greater than 0');
    });

    it('should throw error for limit exceeding maximum', () => {
      const options = { page: 1, limit: 1001 };

      expect(() => PaginationHelper.validatePaginationOptions(options)).toThrow('Limit cannot exceed 1000');
    });
  });

  describe('calculateSkip', () => {
    it('should calculate skip correctly for first page', () => {
      const result = PaginationHelper.calculateSkip(1, 10);

      expect(result).toBe(0);
    });

    it('should calculate skip correctly for second page', () => {
      const result = PaginationHelper.calculateSkip(2, 10);

      expect(result).toBe(10);
    });

    it('should calculate skip correctly for third page', () => {
      const result = PaginationHelper.calculateSkip(3, 10);

      expect(result).toBe(20);
    });
  });

  describe('calculateTotalPages', () => {
    it('should calculate total pages correctly', () => {
      const result = PaginationHelper.calculateTotalPages(25, 10);

      expect(result).toBe(3);
    });

    it('should handle zero total items', () => {
      const result = PaginationHelper.calculateTotalPages(0, 10);

      expect(result).toBe(0);
    });

    it('should handle exact division', () => {
      const result = PaginationHelper.calculateTotalPages(20, 10);

      expect(result).toBe(2);
    });
  });
});
