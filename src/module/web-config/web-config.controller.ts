import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WebConfigService } from './web-config.service';
import {
  CreateWebConfigDto,
  UpdateWebConfigDto,
  WebConfigResponseDto,
} from './dto';
import { PaginationDto } from '@shared/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '@module/auth/decorators/public.decorator';

@Controller('web-config')
export class WebConfigController {
  constructor(private readonly webConfigService: WebConfigService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Tạo config mới' })
  @ApiResponse({ status: 201, type: WebConfigResponseDto })
  async create(
    @Body() createWebConfigDto: CreateWebConfigDto,
  ): Promise<WebConfigResponseDto> {
    return this.webConfigService.create(createWebConfigDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách config' })
  async findAll(
    @Query() query: PaginationDto & { search?: string; screen?: string },
  ) {
    return this.webConfigService.findAll(query);
  }

  @Get('all')
  @Public()
  @ApiOperation({ summary: 'Lấy tất cả config không phân trang (cho admin)' })
  async findAllForAdmin(
    @Query('screen') screen?: string,
  ) {
    return this.webConfigService.findAllForAdmin(screen);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Lấy chi tiết config' })
  @ApiResponse({ status: 200, type: WebConfigResponseDto })
  async findOne(@Param('id') id: string): Promise<WebConfigResponseDto> {
    return this.webConfigService.findOne(id);
  }

  @Get('key/:key')
  @Public()
  @ApiOperation({ summary: 'Lấy config theo key' })
  @ApiResponse({ status: 200, type: WebConfigResponseDto })
  async findByKey(
    @Param('key') key: string,
    @Query('screen') screen?: string,
  ): Promise<WebConfigResponseDto> {
    return this.webConfigService.findByKey(key, screen);
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Cập nhật config' })
  @ApiResponse({ status: 200, type: WebConfigResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateWebConfigDto: UpdateWebConfigDto,
  ): Promise<WebConfigResponseDto> {
    return this.webConfigService.update(id, updateWebConfigDto);
  }

  @Delete(':id')
  @Public()
  @ApiOperation({ summary: 'Xóa config' })
  async remove(@Param('id') id: string) {
    return this.webConfigService.remove(id);
  }
}

