import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { AdminRepository } from './admin.repository';
import { PasswordService } from '@shared/utilities/password';
import { PaginationOptions } from '@shared/utilities/pagination';
import { plainToClass } from 'class-transformer';
import {
  CreateAdminDto,
  UpdateAdminDto,
  AdminResponseDto,
  CreateRoleDto,
  UpdateRoleDto,
  CreatePermissionDto,
  UpdatePermissionDto,
  AdminDashboardStatsDto,
  AdminDashboardDataDto,
} from './dto';
import { 
  RoleEntity, 
  PermissionEntity, 
  AdminEntity,
  HumanResourceEntity,
  ServiceEntity,
  BlogEntity,
  ContactEntity,
} from '@shared/entities';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly passwordService: PasswordService,
    @InjectRepository(HumanResourceEntity)
    private readonly humanResourceRepository: Repository<HumanResourceEntity>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
    @InjectRepository(ContactEntity)
    private readonly contactRepository: Repository<ContactEntity>,
  ) {}

  // Admin methods
  async create(createAdminDto: CreateAdminDto): Promise<AdminResponseDto> {
    const { user_email, password, role_id, ...adminData } = createAdminDto;

    // Check if email already exists
    const existingAdmin = await this.adminRepository.findByEmail(user_email);
    if (existingAdmin) {
      throw new ConflictException('Email already exists');
    }

    // Check if role exists
    const role = await this.adminRepository.findRoleById(role_id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Hash password
    const hashedPassword = await this.passwordService.hash(password);

    // Create admin
    const admin = await this.adminRepository.create({
      ...adminData,
      user_email,
      password: hashedPassword,
      role_id,
      json_permission: createAdminDto.json_permission || [],
      is_active: createAdminDto.is_active ?? true,
      is_root: createAdminDto.is_root ?? false,
    });

    return this.toAdminResponseDto(admin);
  }

  async findAll(options: PaginationOptions & { search?: string }): Promise<{
    data: AdminResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const validatedOptions = {
      page: Math.max(1, options.page || 1),
      limit: Math.min(100, Math.max(1, options.limit || 10)),
      search: options.search,
    };

    const result = await this.adminRepository.findAll(validatedOptions);

    return {
      ...result,
      data: result.data.map(admin => this.toAdminResponseDto(admin)),
    };
  }

  async findOne(id: string): Promise<AdminResponseDto> {
    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    return this.toAdminResponseDto(admin);
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<AdminResponseDto> {
    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // Check if email is being changed and if it already exists
    if (updateAdminDto.user_email && updateAdminDto.user_email !== admin.user_email) {
      const existingAdmin = await this.adminRepository.findByEmail(updateAdminDto.user_email);
      if (existingAdmin) {
        throw new ConflictException('Email already exists');
      }
    }

    // Check if role is being changed and if it exists
    if (updateAdminDto.role_id) {
      const role = await this.adminRepository.findRoleById(updateAdminDto.role_id);
      if (!role) {
        throw new NotFoundException('Role not found');
      }
    }

    const updatedAdmin = await this.adminRepository.update(id, updateAdminDto);
    return this.toAdminResponseDto(updatedAdmin);
  }

  async remove(id: string): Promise<{ message: string }> {
    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // Prevent deletion of root admin
    if (admin.is_root) {
      throw new BadRequestException('Cannot delete root admin');
    }

    await this.adminRepository.delete(id);
    return { message: 'Admin deleted successfully' };
  }

  // Role methods
  async createRole(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    return this.adminRepository.createRole(createRoleDto);
  }

  async findAllRoles(options: PaginationOptions & { search?: string }): Promise<{
    data: RoleEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const validatedOptions = {
      page: Math.max(1, options.page || 1),
      limit: Math.min(100, Math.max(1, options.limit || 10)),
      search: options.search,
    };

    return this.adminRepository.findAllRoles(validatedOptions);
  }

  async findOneRole(id: string): Promise<RoleEntity> {
    const role = await this.adminRepository.findRoleById(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleEntity> {
    const role = await this.adminRepository.findRoleById(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return this.adminRepository.updateRole(id, updateRoleDto);
  }

  async removeRole(id: string): Promise<{ message: string }> {
    const role = await this.adminRepository.findRoleById(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await this.adminRepository.deleteRole(id);
    return { message: 'Role deleted successfully' };
  }

  // Permission methods
  async createPermission(createPermissionDto: CreatePermissionDto): Promise<PermissionEntity> {
    // Check if permission_id already exists
    const existingPermission = await this.adminRepository.findPermissionByPermissionId(
      createPermissionDto.permission_id
    );
    if (existingPermission) {
      throw new ConflictException('Permission ID already exists');
    }

    return this.adminRepository.createPermission(createPermissionDto);
  }

  async findAllPermissions(options: PaginationOptions & { search?: string }): Promise<{
    data: PermissionEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const validatedOptions = {
      page: Math.max(1, options.page || 1),
      limit: Math.min(100, Math.max(1, options.limit || 10)),
      search: options.search,
    };

    return this.adminRepository.findAllPermissions(validatedOptions);
  }

  async findOnePermission(id: string): Promise<PermissionEntity> {
    const permission = await this.adminRepository.findPermissionById(id);
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return permission;
  }

  async updatePermission(id: string, updatePermissionDto: UpdatePermissionDto): Promise<PermissionEntity> {
    const permission = await this.adminRepository.findPermissionById(id);
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    // Check if permission_id is being changed and if it already exists
    if (updatePermissionDto.permission_id && updatePermissionDto.permission_id !== permission.permission_id) {
      const existingPermission = await this.adminRepository.findPermissionByPermissionId(
        updatePermissionDto.permission_id
      );
      if (existingPermission) {
        throw new ConflictException('Permission ID already exists');
      }
    }

    return this.adminRepository.updatePermission(id, updatePermissionDto);
  }

  async removePermission(id: string): Promise<{ message: string }> {
    const permission = await this.adminRepository.findPermissionById(id);
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    await this.adminRepository.deletePermission(id);
    return { message: 'Permission deleted successfully' };
  }

  private toAdminResponseDto(admin: AdminEntity): AdminResponseDto {
    return plainToClass(AdminResponseDto, admin, {
      excludeExtraneousValues: true,
    });
  }
}
