import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { PasswordService } from '@shared/utilities/password';
import { AdminEntity } from '@shared/entities';

describe('AuthService', () => {
  let service: AuthService;
  let authRepository: jest.Mocked<AuthRepository>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  let passwordService: jest.Mocked<PasswordService>;

  const mockAdmin: Partial<AdminEntity> = {
    id: 'admin-id',
    user_email: 'admin@lawcompany.com',
    password: 'hashed-password',
    full_name: 'Admin User',
    is_active: true,
    is_root: false,
    expiresIn: 3600,
    json_permission: ['admin:read'],
    refresh_token: 'valid-refresh-token',
    refresh_token_expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    role: {
      id: 'role-id',
      name: 'Admin',
      permissions: 'admin:read,admin:write',
      admins: [],
      is_active: true,
    },
  };

  beforeEach(async () => {
    const mockAuthRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      updateLoginAttempts: jest.fn(),
      updateLastLogin: jest.fn(),
      updateTokens: jest.fn(),
      updateRefreshToken: jest.fn(),
      updatePassword: jest.fn(),
      clearTokens: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn(),
    };

    const mockPasswordService = {
      compare: jest.fn(),
      hash: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
          useValue: mockAuthRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authRepository = module.get(AuthRepository);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
    passwordService = module.get(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginDto = {
        user_email: 'admin@lawcompany.com',
        password: 'password123',
      };

      authRepository.findByEmail.mockResolvedValue(mockAdmin as AdminEntity);
      passwordService.compare.mockResolvedValue(true);
      jwtService.sign.mockReturnValue('access-token');
      configService.get.mockReturnValue('jwt-secret');
      authRepository.updateTokens.mockResolvedValue();
      authRepository.updateLastLogin.mockResolvedValue();

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(result).toHaveProperty('admin');
      expect(authRepository.findByEmail).toHaveBeenCalledWith(loginDto.user_email);
      expect(passwordService.compare).toHaveBeenCalledWith(loginDto.password, mockAdmin.password);
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      const loginDto = {
        user_email: 'invalid@email.com',
        password: 'password123',
      };

      authRepository.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const loginDto = {
        user_email: 'admin@lawcompany.com',
        password: 'wrong-password',
      };

      authRepository.findByEmail.mockResolvedValue(mockAdmin as AdminEntity);
      passwordService.compare.mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for inactive account', async () => {
      const loginDto = {
        user_email: 'admin@lawcompany.com',
        password: 'password123',
      };

      const inactiveAdmin = { ...mockAdmin, is_active: false };
      authRepository.findByEmail.mockResolvedValue(inactiveAdmin as AdminEntity);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for locked account', async () => {
      const loginDto = {
        user_email: 'admin@lawcompany.com',
        password: 'password123',
      };

      const lockedAdmin = { 
        ...mockAdmin, 
        locked_until: new Date(Date.now() + 10000) // Future date
      };
      authRepository.findByEmail.mockResolvedValue(lockedAdmin as AdminEntity);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const refreshTokenDto = {
        refresh_token: 'valid-refresh-token',
      };

      const payload = { sub: 'admin-id' };
      jwtService.verify.mockImplementation((token, options) => {
        return payload;
      });
      authRepository.findById.mockResolvedValue(mockAdmin as AdminEntity);
      jwtService.sign.mockReturnValue('new-access-token');
      configService.get.mockReturnValue('jwt-secret');
      authRepository.updateRefreshToken.mockResolvedValue();

      const result = await service.refreshToken(refreshTokenDto);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(result).toHaveProperty('expires_in');
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      const refreshTokenDto = {
        refresh_token: 'invalid-refresh-token',
      };

      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken(refreshTokenDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const changePasswordDto = {
        current_password: 'old-password',
        new_password: 'new-password',
      };

      authRepository.findById.mockResolvedValue(mockAdmin as AdminEntity);
      passwordService.compare.mockResolvedValue(true);
      passwordService.hash.mockResolvedValue('hashed-new-password');
      authRepository.updatePassword.mockResolvedValue();
      authRepository.clearTokens.mockResolvedValue();

      const result = await service.changePassword('admin-id', changePasswordDto);

      expect(result).toEqual({ message: 'Password changed successfully' });
      expect(passwordService.compare).toHaveBeenCalledWith(changePasswordDto.current_password, mockAdmin.password);
      expect(passwordService.hash).toHaveBeenCalledWith(changePasswordDto.new_password);
    });

    it('should throw NotFoundException for non-existent admin', async () => {
      const changePasswordDto = {
        current_password: 'old-password',
        new_password: 'new-password',
      };

      authRepository.findById.mockResolvedValue(null);

      await expect(service.changePassword('invalid-id', changePasswordDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for incorrect current password', async () => {
      const changePasswordDto = {
        current_password: 'wrong-password',
        new_password: 'new-password',
      };

      authRepository.findById.mockResolvedValue(mockAdmin as AdminEntity);
      passwordService.compare.mockResolvedValue(false);

      await expect(service.changePassword('admin-id', changePasswordDto)).rejects.toThrow('Current password is incorrect');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      authRepository.clearTokens.mockResolvedValue();

      const result = await service.logout('admin-id');

      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(authRepository.clearTokens).toHaveBeenCalledWith('admin-id');
    });
  });

  describe('validateAdmin', () => {
    it('should return admin if found', async () => {
      authRepository.findById.mockResolvedValue(mockAdmin as AdminEntity);

      const result = await service.validateAdmin('admin-id');

      expect(result).toEqual(mockAdmin);
      expect(authRepository.findById).toHaveBeenCalledWith('admin-id');
    });

    it('should return null if admin not found', async () => {
      authRepository.findById.mockResolvedValue(null);

      const result = await service.validateAdmin('invalid-id');

      expect(result).toBeNull();
    });
  });
});
