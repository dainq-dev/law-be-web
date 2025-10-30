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
import { ServicesService } from './services.service';
import {
  CreateServiceDto,
  UpdateServiceDto,
  ServiceResponseDto,
} from './dto';
import { PaginationOptions } from '@shared/utilities/pagination';
import { Public } from '@module/auth/decorators/public.decorator';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) { }

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create new service' })
  @ApiResponse({
    status: 201,
    description: 'Service created successfully',
    type: ServiceResponseDto,
  })
  async create(@Body() createServiceDto: CreateServiceDto): Promise<ServiceResponseDto> {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all services with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Services retrieved successfully',
  })
  async findAll(
    @Query() options: PaginationOptions & { search?: string; },
  ): Promise<{
    data: ServiceResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.servicesService.findAll(options);
  }

  @Get('featured')
  @Public()
  @ApiOperation({ summary: 'Get featured services' })
  @ApiResponse({
    status: 200,
    description: 'Featured services retrieved successfully',
    type: [ServiceResponseDto],
  })
  async findFeatured(): Promise<ServiceResponseDto[]> {
    return this.servicesService.findFeatured();
  }

  @Get('by-tags')
  @Public()
  @ApiOperation({ summary: 'Get services by tags' })
  @ApiQuery({ name: 'tags', required: true, type: String, isArray: true })
  @ApiResponse({
    status: 200,
    description: 'Services retrieved successfully',
    type: [ServiceResponseDto],
  })
  async findByTags(@Query('tags') tags: string[]): Promise<ServiceResponseDto[]> {
    return this.servicesService.findByTags(tags);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get service by ID' })
  @ApiResponse({
    status: 200,
    description: 'Service retrieved successfully',
    type: ServiceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async findOne(@Param('id') id: string): Promise<ServiceResponseDto> {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Update service' })
  @ApiResponse({ status: 200, description: 'Service updated successfully', type: ServiceResponseDto, })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<ServiceResponseDto> {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @Public()
  @ApiOperation({ summary: 'Delete service' })
  @ApiResponse({
    status: 200,
    description: 'Service deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.servicesService.remove(id);
  }
  
  // Translation endpoints removed - translations are now stored as columns in the main entity
}
