import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, LessThan, MoreThan } from 'typeorm';
import { OtpEntity } from '@shared/entities';

@Injectable()
export class OtpService {
  private readonly OTP_LIFETIME_MINUTES = 5; // 5 phút

  constructor(
    @InjectRepository(OtpEntity)
    private readonly otpRepository: Repository<OtpEntity>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Generate OTP ngẫu nhiên 6 chữ số
   */
  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Tạo và lưu OTP vào database với thời gian hết hạn 5 phút
   * Nếu đã có OTP còn hạn trong database thì trả về OTP đó, không tạo mới
   * Chỉ tạo OTP mới khi OTP cũ đã hết hạn
   * @param identifier - Key để identify OTP (vd: 'block-website')
   * @returns OTP đã được tạo hoặc OTP còn hạn
   */
  async createOtp(identifier: string = 'default'): Promise<string> {
    const now = new Date();
    const nowTimestamp = Date.now();

    // Sử dụng transaction với advisory lock để đảm bảo chỉ 1 request xử lý tại một thời điểm
    return await this.dataSource.transaction(async (manager) => {
      // Sử dụng PostgreSQL advisory lock dựa trên hash của identifier
      const lockId = this.hashIdentifier(identifier);
      
      try {
        // Lock với advisory lock (sẽ tự động unlock khi transaction commit/rollback)
        await manager.query('SELECT pg_advisory_xact_lock($1)', [lockId]);

        // Tìm OTP chưa sử dụng của identifier (lấy mới nhất)
        const existingOtp = await manager.findOne(OtpEntity, {
          where: {
            identifier,
            is_used: false,
          },
          order: {
            created_at: 'DESC',
          },
        });

        // Nếu có OTP, kiểm tra xem còn hạn không
        if (existingOtp) {
          const expiresAtDate = existingOtp.expires_at instanceof Date 
            ? existingOtp.expires_at 
            : new Date(existingOtp.expires_at);
          
          const expiresAtTimestamp = expiresAtDate.getTime();
          
          // So sánh timestamp
          if (expiresAtTimestamp > nowTimestamp) {
            console.log(`[OTP Service] ✅ Found existing valid OTP: ${existingOtp.otp_code}`);
            console.log(`  - expires_at: ${expiresAtDate.toISOString()} (timestamp: ${expiresAtTimestamp})`);
            console.log(`  - now: ${now.toISOString()} (timestamp: ${nowTimestamp})`);
            console.log(`  - remaining: ${Math.round((expiresAtTimestamp - nowTimestamp) / 1000)} seconds`);
            return existingOtp.otp_code;
          } else {
            console.log(`[OTP Service] ⚠️ Existing OTP expired: ${existingOtp.otp_code}`);
            // Xóa OTP đã hết hạn
            await manager.delete(OtpEntity, { id: existingOtp.id });
          }
        } else {
          console.log(`[OTP Service] ℹ️ No existing OTP found for identifier: ${identifier}`);
        }

        // Nếu không có OTP còn hạn, tạo OTP mới
        const otp = this.generateOtp();
        const expiresAt = new Date(Date.now() + this.OTP_LIFETIME_MINUTES * 60 * 1000);

        // Xóa các OTP cũ đã hết hạn của cùng identifier (cleanup)
        await manager
          .createQueryBuilder()
          .delete()
          .from(OtpEntity)
          .where('identifier = :identifier', { identifier })
          .andWhere('is_used = :is_used', { is_used: false })
          .andWhere('expires_at <= :now', { now })
          .execute();

        // Tạo OTP mới
        const otpEntity = manager.create(OtpEntity, {
          identifier,
          otp_code: otp,
          expires_at: expiresAt,
          is_used: false,
          is_active: true,
        });

        await manager.save(otpEntity);

        console.log(`[OTP Service] 🆕 Created new OTP: ${otp}`);
        console.log(`  - expires_at: ${expiresAt.toISOString()}`);
        console.log(`  - identifier: ${identifier}`);

        return otp;
      } catch (error) {
        console.error(`[OTP Service] Error creating OTP:`, error);
        throw error;
      }
    });
  }

  /**
   * Hash identifier thành số nguyên để dùng cho advisory lock
   */
  private hashIdentifier(identifier: string): number {
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      const char = identifier.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Validate OTP
   * @param otp - OTP cần validate
   * @param identifier - Key identifier
   * @returns true nếu OTP hợp lệ, false nếu không hợp lệ hoặc đã hết hạn
   */
  async validateOtp(otp: string, identifier: string = 'default'): Promise<boolean> {
    // Sử dụng transaction để đảm bảo tính nhất quán
    return await this.dataSource.transaction(async (manager) => {
      const otpEntity = await manager.findOne(OtpEntity, {
        where: {
          identifier,
          otp_code: otp,
          is_used: false,
        },
        order: {
          created_at: 'DESC',
        },
      });

      if (!otpEntity) {
        return false; // OTP không tồn tại
      }

      // Check hết hạn
      if (new Date() > otpEntity.expires_at) {
        // Tìm và xóa 1 OTP đã used cũ (nếu có) để tránh unique constraint violation
        const usedOtp = await manager.findOne(OtpEntity, {
          where: {
            identifier,
            is_used: true,
          },
          order: {
            used_at: 'ASC', // Xóa OTP cũ nhất
          },
        });
        
        if (usedOtp) {
          await manager.delete(OtpEntity, { id: usedOtp.id });
        }
        
        // Đánh dấu đã hết hạn
        otpEntity.is_used = true;
        otpEntity.used_at = new Date();
        await manager.save(otpEntity);
        return false; // OTP đã hết hạn
      }

      // Tìm và xóa 1 OTP đã used cũ (nếu có) để tránh unique constraint violation
      const usedOtp = await manager.findOne(OtpEntity, {
        where: {
          identifier,
          is_used: true,
        },
        order: {
          used_at: 'ASC', // Xóa OTP cũ nhất
        },
      });
      
      if (usedOtp) {
        await manager.delete(OtpEntity, { id: usedOtp.id });
      }

      // OTP hợp lệ, đánh dấu đã sử dụng
      otpEntity.is_used = true;
      otpEntity.used_at = new Date();
      await manager.save(otpEntity);

      return true;
    });
  }

  /**
   * Clear OTP cho identifier
   */
  async clearOtp(identifier: string = 'default'): Promise<void> {
    await this.otpRepository.delete({
      identifier,
      is_used: false,
    });
  }

  /**
   * Cleanup tất cả OTP đã hết hạn (có thể chạy định kỳ bằng cron job)
   */
  async cleanupExpiredOtps(): Promise<void> {
    const now = new Date();
    await this.otpRepository.delete({
      expires_at: LessThan(now),
    });
  }

  /**
   * Xóa các OTP đã được sử dụng (cleanup old records)
   */
  async cleanupUsedOtps(daysOld: number = 7): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    await this.otpRepository.delete({
      is_used: true,
      used_at: LessThan(cutoffDate),
    });
  }
}

