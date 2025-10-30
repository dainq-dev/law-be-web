import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ContactRepository } from './contact.repository';
import { PaginationOptions } from '@shared/utilities/pagination';
import { plainToClass } from 'class-transformer';
import { EmailService } from '@shared/services/email.service';
import {
  CreateContactDto,
  UpdateContactDto,
  ContactResponseDto,
} from './dto';
import { ContactEntity } from '@shared/entities';

@Injectable()
export class ContactService {
  constructor(
    private readonly contactRepository: ContactRepository,
  ) {}

  async create(
    createContactDto: CreateContactDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<string> {
    const contactData = {
      ...createContactDto,
      ip_address: ipAddress,
      user_agent: userAgent,
    };
    const contact = await this.contactRepository.create(contactData);
    return 'Contact created successfully';
  }

  async findAll(
  ): Promise<ContactResponseDto[]> {
    try {
      const result = await this.contactRepository.findAll();
      return result.map(contact => this.toContactResponseDto(contact));
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string): Promise<ContactResponseDto> {
    const contact = await this.contactRepository.findById(id);
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }
    return this.toContactResponseDto(contact);
  }

  async update(
    id: string,
    updateContactDto: UpdateContactDto,
  ): Promise<ContactResponseDto> {
    const contact = await this.contactRepository.findById(id);
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    const updateData: any = { ...updateContactDto };

    const updatedContact = await this.contactRepository.update(id, updateData);
    if (!updatedContact) {
      throw new NotFoundException('Contact not found after update');
    }
    return this.toContactResponseDto(updatedContact);
  }

  async remove(id: string): Promise<{ message: string }> {
    const contact = await this.contactRepository.findById(id);
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    await this.contactRepository.delete(id);
    return { message: 'Contact deleted successfully' };
  }

  private toContactResponseDto(contact: ContactEntity): ContactResponseDto {
    return plainToClass(ContactResponseDto, contact, {
      excludeExtraneousValues: true,
    });
  }
}

