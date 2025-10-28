import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from './auth.repository';
import { LoginDto, RefreshTokenDto, ChangePasswordDto } from './dto';
import { AuthResponseDto, RefreshTokenResponseDto, AuthAdminResponseDto } from './dto/auth-response.dto';
import { JsonToken } from '@shared/interface/token.interface';
import { PasswordService } from '@shared/utilities/password';
import { plainToClass } from 'class-transformer';
import { AdminEntity } from '@shared/entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly passwordService: PasswordService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { user_email, password } = loginDto;

    // Find admin by email
    const admin = await this.authRepository.findByEmail(user_email);
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is locked
    if (admin.locked_until && admin.locked_until > new Date()) {
      throw new UnauthorizedException('Account is temporarily locked');
    }

    // Check if account is active
    if (!admin.is_active) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await this.passwordService.compare(
      password,
      admin.password,
    );
    if (!isPasswordValid) {
      await this.handleFailedLogin(admin.id);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(admin);
    const refreshToken = this.generateRefreshToken(admin);
    // Parse refresh token expiration time (default 7 days in seconds)
    const refreshExpiresInSeconds = this.parseExpirationTime(
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d')
    );
    const refreshTokenExpires = new Date(Date.now() + refreshExpiresInSeconds * 1000);

    // Update admin with new tokens
    await this.authRepository.updateTokens(
      admin.id,
      tokens,
      refreshToken,
      refreshTokenExpires,
    );

    // Update last login
    await this.authRepository.updateLastLogin(admin.id);

    // Return response
    return {
      access_token: tokens[tokens.length - 1].token,
      refresh_token: refreshToken,
      expires_in: admin.expiresIn,
      admin: this.toAdminResponseDto(admin),
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
    const { refresh_token } = refreshTokenDto;

    try {
      const payload = this.jwtService.verify(refresh_token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'kymlawyer-super-secret-refresh-key-2024',
      });

      const admin = await this.authRepository.findById(payload.sub);
      if (!admin || admin.refresh_token !== refresh_token) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (admin.refresh_token_expires && admin.refresh_token_expires < new Date()) {
        throw new UnauthorizedException('Refresh token expired');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(admin);
      const newRefreshToken = this.generateRefreshToken(admin);
      // Parse refresh token expiration time (default 7 days in seconds)
      const refreshExpiresInSeconds = this.parseExpirationTime(
        this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d')
      );
      const refreshTokenExpires = new Date(Date.now() + refreshExpiresInSeconds * 1000);

      // Update tokens
      await this.authRepository.updateRefreshToken(
        admin.id,
        newRefreshToken,
        refreshTokenExpires,
      );

      return {
        access_token: tokens[tokens.length - 1].token,
        refresh_token: newRefreshToken,
        expires_in: admin.expiresIn,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async changePassword(
    adminId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { current_password, new_password } = changePasswordDto;

    const admin = await this.authRepository.findById(adminId);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await this.passwordService.compare(
      current_password,
      admin.password,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await this.passwordService.hash(new_password);

    // Update password
    await this.authRepository.updatePassword(adminId, hashedNewPassword);

    // Clear all tokens to force re-login
    await this.authRepository.clearTokens(adminId);

    return { message: 'Password changed successfully' };
  }

  async logout(adminId: string): Promise<{ message: string }> {
    await this.authRepository.clearTokens(adminId);
    return { message: 'Logged out successfully' };
  }

  async validateAdmin(adminId: string): Promise<AdminEntity | null> {
    return this.authRepository.findById(adminId);
  }

  private async generateTokens(admin: AdminEntity): Promise<JsonToken[]> {
    const payload = {
      sub: admin.id,
      email: admin.user_email,
      role: admin.role?.name,
      permissions: admin.json_permission,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: `${admin.expiresIn}s`,
    });

    const tokenData: JsonToken = {
      token: accessToken,
      created_at: new Date(),
      expires_at: new Date(Date.now() + admin.expiresIn * 1000),
      device_info: 'Web Browser',
      ip_address: '127.0.0.1', // This should be passed from request
    };

    // Keep only last 5 tokens
    const existingTokens = admin.json_token || [];
    const updatedTokens = [...existingTokens, tokenData].slice(-5);

    return updatedTokens;
  }

  private generateRefreshToken(admin: AdminEntity): string {
    const payload = {
      sub: admin.id,
      type: 'refresh',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'kymlawyer-super-secret-refresh-key-2024',
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });
  }

  private async handleFailedLogin(adminId: string): Promise<void> {
    const admin = await this.authRepository.findById(adminId);
    if (!admin) return;

    const maxAttempts = 5;
    const lockTime = 15 * 60 * 1000; // 15 minutes

    const attempts = admin.login_attempts + 1;
    const lockedUntil = attempts >= maxAttempts 
      ? new Date(Date.now() + lockTime)
      : null;

    await this.authRepository.updateLoginAttempts(adminId, attempts, lockedUntil || undefined);
  }

  private parseExpirationTime(expirationTime: string): number {
    // If it's already a number (in seconds), return it
    const numericValue = parseInt(expirationTime, 10);
    if (!isNaN(numericValue)) {
      return numericValue;
    }

    // Parse string formats like '7d', '24h', '60m', '3600s'
    const match = expirationTime.match(/^(\d+)([dhms])$/);
    if (!match) {
      // Default to 7 days if format is invalid
      return 7 * 24 * 60 * 60;
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 'd': // days
        return value * 24 * 60 * 60;
      case 'h': // hours
        return value * 60 * 60;
      case 'm': // minutes
        return value * 60;
      case 's': // seconds
        return value;
      default:
        return 7 * 24 * 60 * 60; // Default to 7 days
    }
  }

  private toAdminResponseDto(admin: AdminEntity): AuthAdminResponseDto {
    return plainToClass(AuthAdminResponseDto, admin, {
      excludeExtraneousValues: true,
    });
  }
}
