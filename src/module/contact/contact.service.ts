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
      status: 'pending',
      ip_address: ipAddress,
      user_agent: userAgent,
    };
    console.log("🚀 ~ ContactService ~ create ~ contactData:", contactData)
    const contact = await this.contactRepository.create(contactData);
    return 'Contact created successfully'
  }

  async findAll(
  ): Promise<any[]> {
    try {
      const result = await this.contactRepository.findAll();
      console.log("🚀 ~ ContactService ~ findAll ~ result:", result)
      return result
    } catch (error) {
      throw new BadRequestException(error.message)
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

    // Set responded_at if status is changed to completed
    if (updateContactDto.status === 'completed' && contact.status !== 'completed') {
      updateData.responded_at = new Date();
    }

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

