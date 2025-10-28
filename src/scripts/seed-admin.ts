import { DataSource } from 'typeorm';
import { AppDataSource } from '../config/database/typeorm.config';
import { AdminEntity } from '../shared/entities/admin.entity';
import { RoleEntity } from '../shared/entities/role.entity';
import { PermissionEntity } from '../shared/entities/permission.entity';
import { PasswordService } from '../shared/utilities/password';

async function seedAdmin() {
  const dataSource = new DataSource(AppDataSource);
  
  try {
    await dataSource.initialize();
    console.log('Database connected successfully');

    const adminRepository = dataSource.getRepository(AdminEntity);
    const roleRepository = dataSource.getRepository(RoleEntity);
    const permissionRepository = dataSource.getRepository(PermissionEntity);
    const passwordService = new PasswordService();

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
        console.log(`Created permission: ${permData.name}`);
      }
    }

    // Create root role
    const rootRole = await roleRepository.findOne({ where: { name: 'Root Admin' } });
    if (!rootRole) {
      const role = roleRepository.create({
        name: 'Root Admin',
        permissions: JSON.stringify(permissions.map(p => p.permission_id)),
      });
      await roleRepository.save(role);
      console.log('Created root role');
    }

    // Create admin user
    const existingAdmin = await adminRepository.findOne({
      where: { user_email: 'admin@lawcompany.com' },
    });

    if (!existingAdmin) {
      const hashedPassword = await passwordService.hash('admin123');
      const admin = adminRepository.create({
        user_email: 'admin@lawcompany.com',
        password: hashedPassword,
        full_name: 'System Administrator',
        phone_number: '+1234567890',
        role_id: (await roleRepository.findOne({ where: { name: 'Root Admin' } }))?.id,
        json_permission: permissions.map(p => p.permission_id),
        is_active: true,
        is_root: true,
        is_first_account: true,
        expiresIn: 3600,
      });

      await adminRepository.save(admin);
      console.log('Created admin user: admin@lawcompany.com / admin123');
    } else {
      console.log('Admin user already exists');
    }

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await dataSource.destroy();
  }
}

seedAdmin();
