import { Controller, Get, Post, Body, Param, Patch, Delete, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { Public } from '../auth/decorators/public.decorator';
import { CreateContactDto, ContactResponseDto, UpdateContactDto } from './dto';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Tạo liên hệ mới' })
  @ApiResponse({ status: 201, description: 'Contact created successfully' })
  async create(
    @Body() createContactDto: CreateContactDto,
    @Req() req: any,
  ): Promise<string> {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.contactService.create(createContactDto, ipAddress, userAgent);
  }
  
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách liên hệ' })
  @ApiResponse({ status: 200, type: [ContactResponseDto] })
  async findAll(): Promise<ContactResponseDto[]> {
    return this.contactService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết liên hệ' })
  @ApiResponse({ status: 200, type: ContactResponseDto })
  async findOne(@Param('id') id: string): Promise<ContactResponseDto> {
    return this.contactService.findOne(id);
  }
}
