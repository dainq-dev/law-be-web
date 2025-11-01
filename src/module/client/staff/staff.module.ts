import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  HumanResourceEntity,
} from '@shared/entities';
import { PublicStaffController } from './staff.controller';
import { PublicStaffService } from './staff.service';
import { PublicStaffRepository } from './staff.repository';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HumanResourceEntity
    ]),
    CommonModule,
  ],
  controllers: [PublicStaffController],
  providers: [PublicStaffService, PublicStaffRepository],
  exports: [PublicStaffService],
})
export class PublicStaffModule {}
