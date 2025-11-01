import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CommonRepository } from './common.repository';
import { OtpService } from './otp.service';

@Injectable()
export class commonService {
  constructor(
    private readonly commonRepository: CommonRepository,
    private readonly otpService: OtpService,
  ) {}

  /**
   * Tạo OTP để sử dụng cho việc disable website
   * @returns OTP string (6 chữ số)
   */
  async generateOtp(): Promise<string> {
    return await this.otpService.createOtp('block-website');
  }

  /**
   * Disable website bằng OTP + secret_key
   * @param otp - OTP từ API generate
   * @param secretKey - Secret key từ environment variable
   * @returns Kết quả disable
   */
  async disableWebsite(otp: string, secretKey: string): Promise<string> {
    try {
       // Validate secret key
    if (secretKey !== process.env.SECRET_KEY) {
      throw new BadRequestException('Invalid secret key');
    }

    // Validate OTP
    const isValidOtp = await this.otpService.validateOtp(otp, 'block-website');
    if (!isValidOtp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Disable website trong webconfig
    await this.commonRepository.disableWebsite();
    await this.otpService.clearOtp('block-website');

    return 'Website has been disabled successfully';
    } catch (error) {
      throw error;
    }
   
  }

  /**
   * Enable website bằng OTP + secret_key
   * @param otp - OTP từ API generate
   * @param secretKey - Secret key từ environment variable
   * @returns Kết quả enable
   */
  async enableWebsite(otp: string, secretKey: string): Promise<string> {
    // Validate secret key
    if (secretKey !== process.env.SECRET_KEY) {
      throw new BadRequestException('Invalid secret key');
    }

    // Validate OTP
    const isValidOtp = await this.otpService.validateOtp(otp, 'block-website');
    if (!isValidOtp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Enable website trong webconfig
    await this.commonRepository.enableWebsite();
    await this.otpService.clearOtp('block-website');

    return 'Website has been enabled successfully';
  }

  /**
   * Kiểm tra trạng thái website enabled
   * @returns true nếu website enabled, false nếu disabled
   */
  async isWebsiteEnabled(): Promise<boolean> {
    return this.commonRepository.isWebsiteEnabled();
  }
}
