import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { commonService } from './common.service';
import { Public } from '../../auth/decorators/public.decorator';

@Controller('block-website')
export class CommonController {
  constructor(private readonly commonService: commonService) {}

  @Get('otp')
  @Public()
  async getOtp(): Promise<{ otp: string; expiresIn: number; message: string }> {
    const otp = await this.commonService.generateOtp();
    return {
      otp,
      expiresIn: 300, // 5 phút = 300 giây
      message: 'OTP has been generated successfully!',
    };
  }

  @Get('disable')
  @Public()
  async disableWebsite(
    @Query('otp') otp: string,
    @Query('secret_key') secret_key: string,
  ): Promise<string> {
    if (!otp || !secret_key) {
      throw new BadRequestException('OTP and secret_key are required');
    }

    return this.commonService.disableWebsite(otp, secret_key);
  }
  
  // enable website
  @Get('enable')
  @Public()
  async enableWebsite(
    @Query('otp') otp: string,
    @Query('secret_key') secret_key: string,
  ): Promise<string> {
    if (!otp || !secret_key) {
      throw new BadRequestException('OTP and secret_key are required');
    }
    
    return this.commonService.enableWebsite(otp, secret_key);
  }
}
