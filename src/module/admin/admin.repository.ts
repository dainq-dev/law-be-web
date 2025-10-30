import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminEntity } from '@shared/entities/admin.entity';
import { RoleEntity } from '@shared/entities/role.entity';
import { PermissionEntity } from '@shared/entities/permission.entity';
import { PaginationOptions } from '@shared/utilities/pagination';

@Injectable()
export class AdminRepository {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {}

  // Admin methods
  async create(adminData: Partial<AdminEntity>): Promise<AdminEntity> {
    const admin = this.adminRepository.create(adminData);
    return this.adminRepository.save(admin);
  }

  async findAll(options: PaginationOptions & { search?: string }): Promise<{
    data: AdminEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.adminRepository
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.role', 'role')
      .skip(skip)
      .take(limit)
      .orderBy('admin.created_at', 'DESC');

    if (options.search) {
      queryBuilder.where(
        '(admin.full_name ILIKE :search OR admin.user_email ILIKE :search)',
        { search: `%${options.search}%` }
      );
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<AdminEntity | null> {
    return this.adminRepository.findOne({
      where: { id },
      relations: ['role'],
    });
  }

  async findByEmail(email: string): Promise<AdminEntity | null> {
    return this.adminRepository.findOne({
      where: { user_email: email },
      relations: ['role'],
    });
  }

  async update(id: string, adminData: Partial<AdminEntity>): Promise<AdminEntity> {
    await this.adminRepository.update(id, adminData);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Admin not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.adminRepository.delete(id);
  }

  // Role methods
  async createRole(roleData: Partial<RoleEntity>): Promise<RoleEntity> {
    const role = this.roleRepository.create(roleData);
    return this.roleRepository.save(role);
  }

  async findAllRoles(options: PaginationOptions & { search?: string }): Promise<{
    data: RoleEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .skip(skip)
      .take(limit)
      .orderBy('role.created_at', 'DESC');

    if (options.search) {
      queryBuilder.where('role.name ILIKE :search', { search: `%${options.search}%` });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findRoleById(id: string): Promise<RoleEntity | null> {
    return this.roleRepository.findOne({ where: { id } });
  }

  async updateRole(id: string, roleData: Partial<RoleEntity>): Promise<RoleEntity> {
    await this.roleRepository.update(id, roleData);
    const updated = await this.findRoleById(id);
    if (!updated) {
      throw new Error('Role not found after update');
    }
    return updated;
  }

  async deleteRole(id: string): Promise<void> {
    await this.roleRepository.delete(id);
  }

  // Permission methods
  async createPermission(permissionData: Partial<PermissionEntity>): Promise<PermissionEntity> {
    const permission = this.permissionRepository.create(permissionData);
    return this.permissionRepository.save(permission);
  }

  async findAllPermissions(options: PaginationOptions & { search?: string }): Promise<{
    data: PermissionEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.permissionRepository
      .createQueryBuilder('permission')
      .skip(skip)
      .take(limit)
      .orderBy('permission.created_at', 'DESC');

    if (options.search) {
      queryBuilder.where(
        '(permission.name ILIKE :search OR permission.permission_id ILIKE :search)',
        { search: `%${options.search}%` }
      );
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findPermissionById(id: string): Promise<PermissionEntity | null> {
    return this.permissionRepository.findOne({ where: { id } });
  }

  async findPermissionByPermissionId(permissionId: string): Promise<PermissionEntity | null> {
    return this.permissionRepository.findOne({ where: { permission_id: permissionId } });
  }

  async updatePermission(id: string, permissionData: Partial<PermissionEntity>): Promise<PermissionEntity> {
    await this.permissionRepository.update(id, permissionData);
    const updated = await this.findPermissionById(id);
    if (!updated) {
      throw new Error('Permission not found after update');
    }
    return updated;
  }

  async deletePermission(id: string): Promise<void> {
    await this.permissionRepository.delete(id);
  }

  async countAdmins(): Promise<number> {
    return this.adminRepository.count();
  }
}
