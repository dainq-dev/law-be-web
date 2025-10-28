import { PasswordService } from './password';

describe('PasswordService', () => {
  let passwordService: PasswordService;

  beforeEach(() => {
    passwordService = new PasswordService();
  });

  describe('hash', () => {
    it('should hash password successfully', async () => {
      const password = 'testPassword123';
      const hashedPassword = await passwordService.hash(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it('should produce different hashes for the same password', async () => {
      const password = 'testPassword123';
      const hash1 = await passwordService.hash(password);
      const hash2 = await passwordService.hash(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('compare', () => {
    it('should return true for matching password and hash', async () => {
      const password = 'testPassword123';
      const hashedPassword = await passwordService.hash(password);

      const result = await passwordService.compare(password, hashedPassword);

      expect(result).toBe(true);
    });

    it('should return false for non-matching password and hash', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword';
      const hashedPassword = await passwordService.hash(password);

      const result = await passwordService.compare(wrongPassword, hashedPassword);

      expect(result).toBe(false);
    });

    it('should return false for empty password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await passwordService.hash(password);

      const result = await passwordService.compare('', hashedPassword);

      expect(result).toBe(false);
    });

    it('should return false for empty hash', async () => {
      const password = 'testPassword123';

      const result = await passwordService.compare(password, '');

      expect(result).toBe(false);
    });
  });
});
