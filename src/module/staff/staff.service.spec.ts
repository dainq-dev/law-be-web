import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { HumanResourcesService } from './staff.service';
import { HumanResourcesRepository } from './staff.repository';
import { CreateHumanResourceDto, UpdateHumanResourceDto, CreateEducationDto, CreateExperienceDto } from './dto';
import { HumanResourceEntity } from '@shared/entities';

describe('HumanResourcesService', () => {
  let service: HumanResourcesService;
  let humanResourcesRepository: jest.Mocked<HumanResourcesRepository>;

  const mockHumanResource: Partial<HumanResourceEntity> = {
    id: 'hr-id',
    first_name: 'John',
    last_name: 'Doe',
    full_name: 'John Doe',
    position: 'Senior Lawyer',
    email: 'john.doe@lawcompany.com',
    phone_number: '+1234567890',
    about: 'Experienced lawyer',
    location: 'New York, NY',
    avatar_url: 'https://example.com/avatar.jpg',
    department: 'Corporate Law',
    date_of_birth: new Date('1990-01-01'),
    gender: 'Male',
    address: '123 Main St',
    sort_order: 1,
    is_active: true,
    is_featured: false,
    company_id: 'company-id',
    company: {
      id: 'company-id',
      company_name: 'Law Company',
      company_email: 'info@lawcompany.com',
      company_size: '50-100',
      phone: '+1234567890',
      code_company: 'LC001',
      address: '123 Legal Street',
      website: 'https://lawcompany.com',
      description: 'Legal services company',
      logo_url: 'https://example.com/logo.png',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    } as any,
  };

  const mockEducation = {
    id: 'education-id',
    degree: 'Bachelor of Laws',
    institution: 'Harvard Law School',
    field_of_study: 'Law',
    start_date: new Date('2010-09-01'),
    end_date: new Date('2014-06-01'),
    grade: '3.8/4.0',
    description: 'Specialized in corporate law',
    human_resource_id: 'hr-id',
  };

  const mockExperience = {
    id: 'experience-id',
    title: 'Senior Associate',
    company: 'Smith & Associates Law Firm',
    location: 'New York, NY',
    start_date: new Date('2018-01-01'),
    end_date: new Date('2022-12-31'),
    is_current: false,
    description: 'Handled complex corporate mergers',
    achievements: 'Led team of 5 lawyers',
    human_resource_id: 'hr-id',
  };

  beforeEach(async () => {
    const mockHumanResourcesRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findFeatured: jest.fn(),
      createEducation: jest.fn(),
      findEducationsByHumanResourceId: jest.fn(),
      findEducationById: jest.fn(),
      updateEducation: jest.fn(),
      deleteEducation: jest.fn(),
      createExperience: jest.fn(),
      findExperiencesByHumanResourceId: jest.fn(),
      findExperienceById: jest.fn(),
      updateExperience: jest.fn(),
      deleteExperience: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HumanResourcesService,
        {
          provide: HumanResourcesRepository,
          useValue: mockHumanResourcesRepository,
        },
      ],
    }).compile();

    service = module.get<HumanResourcesService>(HumanResourcesService);
    humanResourcesRepository = module.get(HumanResourcesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create human resource successfully', async () => {
      const createHumanResourceDto: CreateHumanResourceDto = {
        first_name: 'John',
        last_name: 'Doe',
        position: 'Senior Lawyer',
        email: 'john.doe@lawcompany.com',
        phone_number: '+1234567890',
        about: 'Experienced lawyer',
        company_id: 'company-id',
        is_active: true,
        is_featured: false,
      };

      humanResourcesRepository.findByEmail.mockResolvedValue(null);
      humanResourcesRepository.create.mockResolvedValue(mockHumanResource as HumanResourceEntity);

      const result = await service.create(createHumanResourceDto);

      expect(result).toBeDefined();
      expect(humanResourcesRepository.findByEmail).toHaveBeenCalledWith(createHumanResourceDto.email);
      expect(humanResourcesRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          first_name: createHumanResourceDto.first_name,
          last_name: createHumanResourceDto.last_name,
          full_name: 'John Doe',
          position: createHumanResourceDto.position,
          email: createHumanResourceDto.email,
          company_id: createHumanResourceDto.company_id,
        })
      );
    });

    it('should throw ConflictException if email already exists', async () => {
      const createHumanResourceDto: CreateHumanResourceDto = {
        first_name: 'John',
        last_name: 'Doe',
        position: 'Senior Lawyer',
        email: 'existing@lawcompany.com',
        company_id: 'company-id',
      };

      humanResourcesRepository.findByEmail.mockResolvedValue(mockHumanResource as HumanResourceEntity);

      await expect(service.create(createHumanResourceDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated human resources', async () => {
      const options = { page: 1, limit: 10 };
      const mockResult = {
        data: [mockHumanResource as HumanResourceEntity],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      humanResourcesRepository.findAll.mockResolvedValue(mockResult);

      const result = await service.findAll(options);

      expect(result).toEqual({
        ...mockResult,
        data: expect.any(Array),
      });
      expect(humanResourcesRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: undefined,
        company_id: undefined,
      });
    });
  });

  describe('findOne', () => {
    it('should return human resource by id', async () => {
      humanResourcesRepository.findById.mockResolvedValue(mockHumanResource as HumanResourceEntity);

      const result = await service.findOne('hr-id');

      expect(result).toBeDefined();
      expect(humanResourcesRepository.findById).toHaveBeenCalledWith('hr-id');
    });

    it('should throw NotFoundException if human resource not found', async () => {
      humanResourcesRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update human resource successfully', async () => {
      const updateHumanResourceDto: UpdateHumanResourceDto = {
        first_name: 'Jane',
        last_name: 'Smith',
        position: 'Senior Partner',
      };

      humanResourcesRepository.findById.mockResolvedValue(mockHumanResource as HumanResourceEntity);
      humanResourcesRepository.update.mockResolvedValue(mockHumanResource as HumanResourceEntity);

      const result = await service.update('hr-id', updateHumanResourceDto);

      expect(result).toBeDefined();
      expect(humanResourcesRepository.findById).toHaveBeenCalledWith('hr-id');
      expect(humanResourcesRepository.update).toHaveBeenCalledWith('hr-id', expect.objectContaining({
        full_name: 'Jane Smith',
      }));
    });

    it('should throw NotFoundException if human resource not found', async () => {
      const updateHumanResourceDto: UpdateHumanResourceDto = {
        first_name: 'Jane',
      };

      humanResourcesRepository.findById.mockResolvedValue(null);

      await expect(service.update('invalid-id', updateHumanResourceDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete human resource successfully', async () => {
      humanResourcesRepository.findById.mockResolvedValue(mockHumanResource as HumanResourceEntity);
      humanResourcesRepository.delete.mockResolvedValue();

      const result = await service.remove('hr-id');

      expect(result).toEqual({ message: 'Human resource deleted successfully' });
      expect(humanResourcesRepository.findById).toHaveBeenCalledWith('hr-id');
      expect(humanResourcesRepository.delete).toHaveBeenCalledWith('hr-id');
    });

    it('should throw NotFoundException if human resource not found', async () => {
      humanResourcesRepository.findById.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findFeatured', () => {
    it('should return featured human resources', async () => {
      const featuredHRs = [{ ...mockHumanResource, is_featured: true }];
      humanResourcesRepository.findFeatured.mockResolvedValue(featuredHRs as HumanResourceEntity[]);

      const result = await service.findFeatured();

      expect(result).toEqual(expect.any(Array));
      expect(humanResourcesRepository.findFeatured).toHaveBeenCalled();
    });
  });

  describe('createEducation', () => {
    it('should create education successfully', async () => {
      const createEducationDto: CreateEducationDto = {
        degree: 'Bachelor of Laws',
        institution: 'Harvard Law School',
        field_of_study: 'Law',
        start_date: '2010-09-01',
        end_date: '2014-06-01',
        grade: '3.8/4.0',
        description: 'Specialized in corporate law',
        human_resource_id: 'hr-id',
      };

      humanResourcesRepository.createEducation.mockResolvedValue(mockEducation as any);

      const result = await service.createEducation(createEducationDto);

      expect(result).toEqual(mockEducation);
      expect(humanResourcesRepository.createEducation).toHaveBeenCalledWith(
        expect.objectContaining({
          degree: 'Bachelor of Laws',
          institution: 'Harvard Law School',
          field_of_study: 'Law',
        })
      );
    });
  });

  describe('createExperience', () => {
    it('should create experience successfully', async () => {
      const createExperienceDto: CreateExperienceDto = {
        title: 'Senior Associate',
        company: 'Smith & Associates Law Firm',
        location: 'New York, NY',
        start_date: '2018-01-01',
        end_date: '2022-12-31',
        is_current: false,
        description: 'Handled complex corporate mergers',
        achievements: 'Led team of 5 lawyers',
        human_resource_id: 'hr-id',
      };

      humanResourcesRepository.createExperience.mockResolvedValue(mockExperience as any);

      const result = await service.createExperience(createExperienceDto);

      expect(result).toEqual(mockExperience);
      expect(humanResourcesRepository.createExperience).toHaveBeenCalledWith(
        expect.objectContaining({
          start_date: new Date('2018-01-01'),
          end_date: new Date('2022-12-31'),
        })
      );
    });
  });
});
