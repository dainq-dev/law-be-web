import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminRepository } from './admin.repository';
import { 
  AdminEntity, 
  RoleEntity, 
  PermissionEntity,
  HumanResourceEntity,
  ServiceEntity,
  BlogEntity,
  ContactEntity,
} from '@shared/entities';
import { PasswordService } from '@shared/utilities/password';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdminEntity, 
      RoleEntity, 
      PermissionEntity,
      HumanResourceEntity,
      ServiceEntity,
      BlogEntity,
      ContactEntity,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository, PasswordService],
  exports: [AdminService],
})
export class AdminModule {}
