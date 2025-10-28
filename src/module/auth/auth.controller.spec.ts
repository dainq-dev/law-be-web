import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto, ChangePasswordDto } from './dto';
import { AuthResponseDto, RefreshTokenResponseDto, AuthAdminResponseDto } from './dto/auth-response.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockAuthResponse: AuthResponseDto = {
    access_token: 'access-token',
    refresh_token: 'refresh-token',
    expires_in: 3600,
    admin: {
      id: 'admin-id',
      user_email: 'admin@lawcompany.com',
      full_name: 'Admin User',
      phone_number: '+1234567890',
      role: {
        id: 'role-id',
        name: 'Admin',
        permissions: 'admin:read,admin:write',
      },
      json_permission: ['admin:read'],
      last_login_date: new Date(),
      is_active: true,
      is_root: false,
      password: '',
      json_token: [],
      refresh_token: '',
      reset_password_code: '',
      login_attempts: 0,
      locked_until: new Date(),
    },
  };

  const mockRefreshResponse: RefreshTokenResponseDto = {
    access_token: 'new-access-token',
    refresh_token: 'new-refresh-token',
    expires_in: 3600,
  };

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn(),
      refreshToken: jest.fn(),
      changePassword: jest.fn(),
      logout: jest.fn(),
      validateAdmin: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const loginDto: LoginDto = {
        user_email: 'admin@lawcompany.com',
        password: 'password123',
      };

      authService.login.mockResolvedValue(mockAuthResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual(mockAuthResponse);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const refreshTokenDto: RefreshTokenDto = {
        refresh_token: 'valid-refresh-token',
      };

      authService.refreshToken.mockResolvedValue(mockRefreshResponse);

      const result = await controller.refreshToken(refreshTokenDto);

      expect(result).toEqual(mockRefreshResponse);
      expect(authService.refreshToken).toHaveBeenCalledWith(refreshTokenDto);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const mockRequest = {
        user: { id: 'admin-id' },
      };

      authService.logout.mockResolvedValue({ message: 'Logged out successfully' });

      const result = await controller.logout(mockRequest);

      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(authService.logout).toHaveBeenCalledWith('admin-id');
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const mockRequest = {
        user: { id: 'admin-id' },
      };

      const changePasswordDto: ChangePasswordDto = {
        current_password: 'old-password',
        new_password: 'new-password',
      };

      authService.changePassword.mockResolvedValue({ message: 'Password changed successfully' });

      const result = await controller.changePassword(mockRequest, changePasswordDto);

      expect(result).toEqual({ message: 'Password changed successfully' });
      expect(authService.changePassword).toHaveBeenCalledWith('admin-id', changePasswordDto);
    });
  });

  describe('getProfile', () => {
    it('should get admin profile successfully', async () => {
      const mockRequest = {
        user: { id: 'admin-id' },
      };

      const mockAdmin: AuthAdminResponseDto = {
        id: 'admin-id',
        user_email: 'admin@lawcompany.com',
        full_name: 'Admin User',
        phone_number: '+1234567890',
        role: {
          id: 'role-id',
          name: 'Admin',
          permissions: 'admin:read,admin:write',
        },
        json_permission: ['admin:read'],
        last_login_date: new Date(),
        is_active: true,
        is_root: false,
        password: '',
        json_token: [],
        refresh_token: '',
        reset_password_code: '',
        login_attempts: 0,
        locked_until: new Date(),
      };

      authService.validateAdmin.mockResolvedValue(mockAdmin as any);
      authService['toAdminResponseDto'] = jest.fn().mockReturnValue(mockAdmin);

      const result = await controller.getProfile(mockRequest);

      expect(result).toEqual(mockAdmin);
      expect(authService.validateAdmin).toHaveBeenCalledWith('admin-id');
    });
  });
});
