import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactEntity } from '@shared/entities';
import { PaginationOptions } from '@shared/utilities/pagination';

@Injectable()
export class ContactRepository {
  constructor(
    @InjectRepository(ContactEntity)
    private readonly contactRepository: Repository<ContactEntity>,
  ) {}

  async create(contactData: any) {
    const contact = this.contactRepository.create(contactData);
    return this.contactRepository.save(contact);
  }

  async findById(id: string): Promise<ContactEntity | null> {
    return this.contactRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<ContactEntity[]> {
    return this.contactRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async update(
    id: string,
    contactData: Partial<ContactEntity>,
  ): Promise<ContactEntity | null> {
    await this.contactRepository.update(id, contactData);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.contactRepository.softDelete(id);
  }
}

