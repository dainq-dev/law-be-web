import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppDataSource } from './config/database/typeorm.config';
import { AdminEntity } from './shared/entities/admin.entity';
import { RoleEntity } from './shared/entities/role.entity';
import { PermissionEntity } from './shared/entities/permission.entity';
import { LanguageEntity } from './shared/entities/language.entity';
import { PasswordService } from './shared/utilities/password';

@Injectable()
export class AppService {
  constructor() {}

  // ✅ Sửa từ "public async function seeds()" thành "public async seeds()"
  public async seeds() {
    const dataSource = new DataSource(AppDataSource);
    
    try {
      await dataSource.initialize();
      console.log('Database connected successfully');

      // ✅ Tự động chạy migrations nếu chưa có
      await dataSource.runMigrations();
      console.log('✅ Migrations completed');
  
      const adminRepository = dataSource.getRepository(AdminEntity);
      const roleRepository = dataSource.getRepository(RoleEntity);
      const permissionRepository = dataSource.getRepository(PermissionEntity);
      const languageRepository = dataSource.getRepository(LanguageEntity);
      const passwordService = new PasswordService();
  
      // Check if languages exist, if not create them
      const languageCount = await languageRepository.count();
      if (languageCount === 0) {
        console.log('🌐 No languages found, creating default languages...');
        const languages = [
          {
            code: 'vi',
            name: 'Tiếng Việt',
            native_name: 'Tiếng Việt',
            flag: '🇻🇳',
            is_active: true,
            is_default: true,
            sort_order: 1
          },
          {
            code: 'en',
            name: 'English',
            native_name: 'English',
            flag: '🇺🇸',
            is_active: true,
            is_default: false,
            sort_order: 2
          },
          {
            code: 'zh',
            name: '中文',
            native_name: '中文',
            flag: '🇨🇳',
            is_active: true,
            is_default: false,
            sort_order: 3
          }
        ];

        for (const langData of languages) {
          const language = languageRepository.create(langData);
          await languageRepository.save(language);
        }
        console.log('✅ Default languages created successfully');
      } else {
        console.log('✅ Languages already exist, skipping language seed');
      }

      const adminCount = await adminRepository.count();
      if (adminCount) {
        console.log('Admin already exists, skipping seed');
        return;
      }
      
      // Create permissions
      const permissions = [
        { name: 'Monitor Dashboard', permission_id: 'monitor:dashboard', description: 'Access to monitoring dashboard' },
        { name: 'Staff Management', permission_id: 'staff:manage', description: 'Manage human resources' },
        { name: 'Service Management', permission_id: 'service:manage', description: 'Manage services' },
        { name: 'Blog Management', permission_id: 'blog:manage', description: 'Manage blog posts' },
        { name: 'Config Management', permission_id: 'config:manage', description: 'Manage website configuration' },
        { name: 'Contact Management', permission_id: 'contact:manage', description: 'Manage contact forms' },
      ];
  
      for (const permData of permissions) {
        const existingPermission = await permissionRepository.findOne({
          where: { permission_id: permData.permission_id },
        });
  
        if (!existingPermission) {
          const permission = permissionRepository.create(permData);
          await permissionRepository.save(permission);
          console.log(`✅ Created permission: ${permData.name}`);
        }
      }
  
      // Create root role - lưu lại biến để dùng sau
      let rootRole = await roleRepository.findOne({ where: { name: 'Root Admin' } });
      if (!rootRole) {
        const role = roleRepository.create({
          name: 'Root Admin',
          permissions: JSON.stringify(permissions.map(p => p.permission_id)),
        });
        rootRole = await roleRepository.save(role);
        console.log('✅ Created root role');
      }
  
      // Create admin user
      const existingAdmin = await adminRepository.findOne({
        where: { user_email: 'admin@kymlawyer.com' },
      });
  
      if (!existingAdmin) {
        const hashedPassword = await passwordService.hash('kymlawyer@admin');
        const admin = adminRepository.create({
          user_email: 'admin@kymlawyer.com',
          password: hashedPassword,
          full_name: 'Administrator',
          phone_number: '+84 354 625 886',
          role_id: rootRole?.id,
          json_permission: permissions.map(p => p.permission_id),
          is_active: true,
          is_root: true,
          is_first_account: true,
          expiresIn: 3600,
        });
  
        await adminRepository.save(admin);
        console.log('✅ Created admin user: admin@kymlawyer.com / kymlawyer@admin');
      } else {
        console.log('⏭️  Admin user already exists');
      }
  
      console.log('🎉 Seeding completed successfully');
    } catch (error) {
      console.error('❌ Error seeding data:', error);
      throw error; // Throw để error được handle ở onModuleInit
    } finally {
      if (dataSource.isInitialized) {
        await dataSource.destroy();
      }
    }
  }
}