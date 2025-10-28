import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminEntity } from '@shared/entities/admin.entity';
import { JsonToken } from '../../shared/interface/token.interface';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {}

  async findByEmail(email: string): Promise<AdminEntity | null> {
    return this.adminRepository.findOne({
      where: { user_email: email },
      relations: ['role'],
    });
  }

  async findById(id: string): Promise<AdminEntity | null> {
    return this.adminRepository.findOne({
      where: { id },
      relations: ['role'],
    });
  }

  async updateLoginAttempts(
    id: string,
    attempts: number,
    lockedUntil?: Date,
  ): Promise<void> {
    await this.adminRepository.update(id, {
      login_attempts: attempts,
      locked_until: lockedUntil,
    });
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.adminRepository.update(id, {
      last_login_date: new Date(),
      login_attempts: 0,
      locked_until: undefined,
    });
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await this.adminRepository.update(id, {
      password: hashedPassword,
      password_last_update: new Date(),
    });
  }

  async updateTokens(
    id: string,
    tokens: JsonToken[],
    refreshToken: string,
    refreshTokenExpires: Date,
  ): Promise<void> {
    await this.adminRepository.update(id, {
      json_token: tokens,
      refresh_token: refreshToken,
      refresh_token_expires: refreshTokenExpires,
    });
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string,
    refreshTokenExpires: Date,
  ): Promise<void> {
    await this.adminRepository.update(id, {
      refresh_token: refreshToken,
      refresh_token_expires: refreshTokenExpires,
    });
  }

  async clearTokens(id: string): Promise<void> {
    await this.adminRepository.update(id, {
      json_token: [],
      refresh_token: undefined,
      refresh_token_expires: undefined,
    });
  }

  async setPasswordResetCode(
    id: string,
    code: string,
    expires: Date,
  ): Promise<void> {
    await this.adminRepository.update(id, {
      reset_password_code: code,
      reset_password_expires: expires,
    });
  }

  async findByPasswordResetCode(code: string): Promise<AdminEntity | null> {
    return this.adminRepository.findOne({
      where: { reset_password_code: code },
      relations: ['role'],
    });
  }

  async clearPasswordResetCode(id: string): Promise<void> {
    await this.adminRepository.update(id, {
      reset_password_code: undefined,
      reset_password_expires: undefined,
    });
  }
}
