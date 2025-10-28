import { ContactService } from './contact.service';
import { PaginationDto } from '@shared/dto/pagination.dto';
import { Public } from '../auth/decorators/public.decorator';
import { CreateContactDto, ContactResponseDto, } from './dto';
import { Controller, Get, Post, Body, Query, Req, UsePipes, ValidationPipe, UseFilters } from '@nestjs/common';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @Public()
  async create(
    @Body() createContactDto: CreateContactDto,
    @Req() req: any,
  ): Promise<any> {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.contactService.create(createContactDto, ipAddress, userAgent);
  }
  
  @Get()
  @Public()
  async findAll( ): Promise<any[]> {
    console.log("🚀 ~ ContactController ~ findAll ~ findAll:")
    return this.contactService.findAll();
  }
}

