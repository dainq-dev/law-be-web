import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import {
  CreateAdminDto,
  UpdateAdminDto,
  AdminResponseDto,
  CreateRoleDto,
  UpdateRoleDto,
  CreatePermissionDto,
  AdminDashboardStatsDto,
  AdminDashboardDataDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationOptions } from '@shared/utilities/pagination';
import { Public } from '@module/auth/decorators/public.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Admin endpoints
  @Post()
  @Public()
  @ApiOperation({ summary: 'Create new admin' })
  @ApiResponse({
    status: 201,
    description: 'Admin created successfully',
    type: AdminResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async create(@Body() createAdminDto: CreateAdminDto): Promise<AdminResponseDto> {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all admins with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Admins retrieved successfully',
  })
  async findAll(
    @Query() options: PaginationOptions & { search?: string },
  ): Promise<{
    data: AdminResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.adminService.findAll(options);
  }
  
  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get admin by ID' })
  @ApiResponse({
    status: 200,
    description: 'Admin retrieved successfully',
    type: AdminResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  async findOne(@Param('id') id: string): Promise<AdminResponseDto> {
    return this.adminService.findOne(id);
  }
  
  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Update admin' })
  @ApiResponse({
    status: 200,
    description: 'Admin updated successfully',
    type: AdminResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<AdminResponseDto> {
    return this.adminService.update(id, updateAdminDto);
  }
  
  @Delete(':id')
  @Public()
  @ApiOperation({ summary: 'Delete admin' })
  @ApiResponse({
    status: 200,
    description: 'Admin deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.adminService.remove(id);
  }
  
  // Role endpoints
  @Post('roles')
  @Public()
  @ApiOperation({ summary: 'Create new role' })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully',
  })
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.adminService.createRole(createRoleDto);
  }
  
  @Get('roles')
  @Public()
  @ApiOperation({ summary: 'Get all roles with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Roles retrieved successfully',
  })
  async findAllRoles(
    @Query() options: PaginationOptions & { search?: string },
  ) {
    return this.adminService.findAllRoles(options);
  }
  
  @Patch('roles/:id')
  @Public()
  @ApiOperation({ summary: 'Update role' })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.adminService.updateRole(id, updateRoleDto);
  }
  
  @Delete('roles/:id')
  @Public()
  @ApiOperation({ summary: 'Delete role' })
  @ApiResponse({
    status: 200,
    description: 'Role deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async removeRole(@Param('id') id: string): Promise<{ message: string }> {
    return this.adminService.removeRole(id);
  }
  
  // Permission endpoints
  @Post('permissions')
  @Public()
  @ApiOperation({ summary: 'Create new permission' })
  @ApiResponse({
    status: 201,
    description: 'Permission created successfully',
  })
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return this.adminService.createPermission(createPermissionDto);
  }
  
  @Get('permissions')
  @Public()
  @ApiOperation({ summary: 'Get all permissions with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Permissions retrieved successfully',
  })
  async findAllPermissions(
    @Query() options: PaginationOptions & { search?: string },
  ) {
    return this.adminService.findAllPermissions(options);
  }
}
