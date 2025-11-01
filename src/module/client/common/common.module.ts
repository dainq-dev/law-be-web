import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  WebConfigEntity,
  OtpEntity,
} from '@shared/entities';
import { CommonController } from './common.controller';
import { commonService } from './common.service';
import { CommonRepository } from './common.repository';
import { OtpService } from './otp.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WebConfigEntity,
      OtpEntity,
    ]),
  ],
  controllers: [CommonController],
  providers: [commonService, CommonRepository, OtpService],
  exports: [commonService, OtpService, CommonRepository],
})
export class CommonModule {}
