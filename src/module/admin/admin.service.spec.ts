import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminRepository } from './admin.repository';
import { PasswordService } from '@shared/utilities/password';
import { CreateAdminDto, UpdateAdminDto, CreateRoleDto, CreatePermissionDto } from './dto';
import { AdminEntity, RoleEntity, PermissionEntity } from '@shared/entities';

describe('AdminService', () => {
  let service: AdminService;
  let adminRepository: jest.Mocked<AdminRepository>;
  let passwordService: jest.Mocked<PasswordService>;

  const mockAdmin: Partial<AdminEntity> = {
    id: 'admin-id',
    user_email: 'admin@lawcompany.com',
    full_name: 'Admin User',
    phone_number: '+1234567890',
    role_id: 'role-id',
    json_permission: ['admin:read'],
    is_active: true,
    is_root: false,
    role: {
      id: 'role-id',
      name: 'Admin',
      permissions: 'admin:read,admin:write',
      admins: [],
      is_active: true,
    },
  };

  const mockRole: Partial<RoleEntity> = {
    id: 'role-id',
    name: 'Admin',
    permissions: 'admin:read,admin:write',
    admins: [],
    is_active: true,
  };

  const mockPermission: Partial<PermissionEntity> = {
    id: 'permission-id',
    name: 'Admin Read',
    permission_id: 'admin:read',
    description: 'Read admin data',
    isActive: true,
  };

  beforeEach(async () => {
    const mockAdminRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createRole: jest.fn(),
      findAllRoles: jest.fn(),
      findRoleById: jest.fn(),
      updateRole: jest.fn(),
      deleteRole: jest.fn(),
      createPermission: jest.fn(),
      findAllPermissions: jest.fn(),
      findPermissionById: jest.fn(),
      findPermissionByPermissionId: jest.fn(),
      updatePermission: jest.fn(),
      deletePermission: jest.fn(),
    };

    const mockPasswordService = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: AdminRepository,
          useValue: mockAdminRepository,
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    adminRepository = module.get(AdminRepository);
    passwordService = module.get(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create admin successfully', async () => {
      const createAdminDto: CreateAdminDto = {
        user_email: 'newadmin@lawcompany.com',
        password: 'password123',
        full_name: 'New Admin',
        phone_number: '+1234567890',
        role_id: 'role-id',
        json_permission: ['admin:read'],
        is_active: true,
        is_root: false,
      };

      adminRepository.findByEmail.mockResolvedValue(null);
      adminRepository.findRoleById.mockResolvedValue(mockRole as RoleEntity);
      passwordService.hash.mockResolvedValue('hashed-password');
      adminRepository.create.mockResolvedValue(mockAdmin as AdminEntity);

      const result = await service.create(createAdminDto);

      expect(result).toBeDefined();
      expect(adminRepository.findByEmail).toHaveBeenCalledWith(createAdminDto.user_email);
      expect(adminRepository.findRoleById).toHaveBeenCalledWith(createAdminDto.role_id);
      expect(passwordService.hash).toHaveBeenCalledWith(createAdminDto.password);
      expect(adminRepository.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      const createAdminDto: CreateAdminDto = {
        user_email: 'existing@lawcompany.com',
        password: 'password123',
        full_name: 'New Admin',
        role_id: 'role-id',
      };

      adminRepository.findByEmail.mockResolvedValue(mockAdmin as AdminEntity);

      await expect(service.create(createAdminDto)).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if role not found', async () => {
      const createAdminDto: CreateAdminDto = {
        user_email: 'newadmin@lawcompany.com',
        password: 'password123',
        full_name: 'New Admin',
        role_id: 'invalid-role-id',
      };

      adminRepository.findByEmail.mockResolvedValue(null);
      adminRepository.findRoleById.mockResolvedValue(null);

      await expect(service.create(createAdminDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated admins', async () => {
      const options = { page: 1, limit: 10 };
      const mockResult = {
        data: [mockAdmin as AdminEntity],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      adminRepository.findAll.mockResolvedValue(mockResult);

      const result = await service.findAll(options);

      expect(result).toEqual({
        ...mockResult,
        data: expect.any(Array),
      });
      expect(adminRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: undefined,
      });
    });
  });

  describe('findOne', () => {
    it('should return admin by id', async () => {
      adminRepository.findById.mockResolvedValue(mockAdmin as AdminEntity);

      const result = await service.findOne('admin-id');

      expect(result).toBeDefined();
      expect(adminRepository.findById).toHaveBeenCalledWith('admin-id');
    });

    it('should throw NotFoundException if admin not found', async () => {
      adminRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update admin successfully', async () => {
      const updateAdminDto: UpdateAdminDto = {
        full_name: 'Updated Admin',
        phone_number: '+9876543210',
      };

      adminRepository.findById.mockResolvedValue(mockAdmin as AdminEntity);
      adminRepository.update.mockResolvedValue(mockAdmin as AdminEntity);

      const result = await service.update('admin-id', updateAdminDto);

      expect(result).toBeDefined();
      expect(adminRepository.findById).toHaveBeenCalledWith('admin-id');
      expect(adminRepository.update).toHaveBeenCalledWith('admin-id', expect.objectContaining(updateAdminDto));
    });

    it('should throw NotFoundException if admin not found', async () => {
      const updateAdminDto: UpdateAdminDto = {
        full_name: 'Updated Admin',
      };

      adminRepository.findById.mockResolvedValue(null);

      await expect(service.update('invalid-id', updateAdminDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete admin successfully', async () => {
      adminRepository.findById.mockResolvedValue(mockAdmin as AdminEntity);
      adminRepository.delete.mockResolvedValue();

      const result = await service.remove('admin-id');

      expect(result).toEqual({ message: 'Admin deleted successfully' });
      expect(adminRepository.findById).toHaveBeenCalledWith('admin-id');
      expect(adminRepository.delete).toHaveBeenCalledWith('admin-id');
    });

    it('should throw BadRequestException if trying to delete root admin', async () => {
      const rootAdmin = { ...mockAdmin, is_root: true };
      adminRepository.findById.mockResolvedValue(rootAdmin as AdminEntity);

      await expect(service.remove('admin-id')).rejects.toThrow(BadRequestException);
    });
  });

  describe('createRole', () => {
    it('should create role successfully', async () => {
      const createRoleDto: CreateRoleDto = {
        name: 'Manager',
        permissions: 'manager:read,manager:write',
      };

      adminRepository.createRole.mockResolvedValue(mockRole as RoleEntity);

      const result = await service.createRole(createRoleDto);

      expect(result).toEqual(mockRole);
      expect(adminRepository.createRole).toHaveBeenCalledWith(createRoleDto);
    });
  });

  describe('createPermission', () => {
    it('should create permission successfully', async () => {
      const createPermissionDto: CreatePermissionDto = {
        name: 'User Read',
        permission_id: 'user:read',
        description: 'Read user data',
        isActive: true,
      };

      adminRepository.findPermissionByPermissionId.mockResolvedValue(null);
      adminRepository.createPermission.mockResolvedValue(mockPermission as PermissionEntity);

      const result = await service.createPermission(createPermissionDto);

      expect(result).toEqual(mockPermission);
      expect(adminRepository.createPermission).toHaveBeenCalledWith(createPermissionDto);
    });

    it('should throw ConflictException if permission_id already exists', async () => {
      const createPermissionDto: CreatePermissionDto = {
        name: 'User Read',
        permission_id: 'user:read',
        description: 'Read user data',
      };

      adminRepository.findPermissionByPermissionId.mockResolvedValue(mockPermission as PermissionEntity);

      await expect(service.createPermission(createPermissionDto)).rejects.toThrow(ConflictException);
    });
  });
});
