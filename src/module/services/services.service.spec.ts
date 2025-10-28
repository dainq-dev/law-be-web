import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesRepository } from './services.repository';
import { CreateServiceDto, UpdateServiceDto, CreateProcessStepDto } from './dto';
import { ServiceEntity } from '@shared/entities';

describe('ServicesService', () => {
  let service: ServicesService;
  let servicesRepository: jest.Mocked<ServicesRepository>;

  const mockService: Partial<ServiceEntity> = {
    id: 'service-id',
    name: 'Corporate Law Consultation',
    short_description: 'Expert corporate legal advice',
    description: 'Comprehensive legal consultation for corporate matters',
    category: 'Corporate Law',
    processing_time: '2-3 business days',
    price: 500,
    currency: 'USD',
    features: 'Expert consultation, Legal documentation',
    requirements: 'Business registration documents',
    image_url: 'https://example.com/service-image.jpg',
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
    processSteps: [
      {
        id: 'step-id',
        step_number: 1,
        title: 'Initial Consultation',
        description: 'We will discuss your legal needs',
        service_id: 'service-id',
        service: {} as any,
        is_active: true,
      },
    ],
  };

  const mockProcessStep = {
    id: 'step-id',
    step_number: 1,
    title: 'Initial Consultation',
    description: 'We will discuss your legal needs and provide initial advice',
    service_id: 'service-id',
    icon_url: 'https://example.com/step-icon.svg',
    duration_hours: 1,
  };

  beforeEach(async () => {
    const mockServicesRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findFeatured: jest.fn(),
      findByTags: jest.fn(),
      createProcessStep: jest.fn(),
      findProcessStepsByServiceId: jest.fn(),
      findProcessStepById: jest.fn(),
      updateProcessStep: jest.fn(),
      deleteProcessStep: jest.fn(),
      reorderProcessSteps: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: ServicesRepository,
          useValue: mockServicesRepository,
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    servicesRepository = module.get(ServicesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create service successfully', async () => {
      const createServiceDto: CreateServiceDto = {
        name: 'Corporate Law Consultation',
        description: 'Comprehensive legal consultation for corporate matters',
        short_description: 'Expert corporate legal advice',
        icon_url: 'https://example.com/icon.svg',
        image_url: 'https://example.com/service-image.jpg',
        price: 500,
        currency: 'USD',
        duration_hours: 2,
        sort_order: 1,
        is_active: true,
        is_featured: false,
        tags: ['corporate', 'legal'],
        company_id: 'company-id',
      };

      servicesRepository.create.mockResolvedValue(mockService as ServiceEntity);

      const result = await service.create(createServiceDto);

      expect(result).toBeDefined();
      expect(servicesRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: createServiceDto.name,
          description: createServiceDto.description,
          sort_order: 1,
          is_active: true,
          is_featured: false,
        })
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated services', async () => {
      const options = { page: 1, limit: 10 };
      const mockResult = {
        data: [mockService as ServiceEntity],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      servicesRepository.findAll.mockResolvedValue(mockResult);

      const result = await service.findAll(options);

      expect(result).toEqual({
        ...mockResult,
        data: expect.any(Array),
      });
      expect(servicesRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: undefined,
        company_id: undefined,
      });
    });
  });

  describe('findOne', () => {
    it('should return service by id', async () => {
      servicesRepository.findById.mockResolvedValue(mockService as ServiceEntity);

      const result = await service.findOne('service-id');

      expect(result).toBeDefined();
      expect(servicesRepository.findById).toHaveBeenCalledWith('service-id');
    });

    it('should throw NotFoundException if service not found', async () => {
      servicesRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update service successfully', async () => {
      const updateServiceDto: UpdateServiceDto = {
        name: 'Updated Service Name',
        description: 'Updated description',
      };

      servicesRepository.findById.mockResolvedValue(mockService as ServiceEntity);
      servicesRepository.update.mockResolvedValue(mockService as ServiceEntity);

      const result = await service.update('service-id', updateServiceDto);

      expect(result).toBeDefined();
      expect(servicesRepository.findById).toHaveBeenCalledWith('service-id');
      expect(servicesRepository.update).toHaveBeenCalledWith('service-id', updateServiceDto);
    });

    it('should throw NotFoundException if service not found', async () => {
      const updateServiceDto: UpdateServiceDto = {
        name: 'Updated Service Name',
      };

      servicesRepository.findById.mockResolvedValue(null);

      await expect(service.update('invalid-id', updateServiceDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete service successfully', async () => {
      servicesRepository.findById.mockResolvedValue(mockService as ServiceEntity);
      servicesRepository.delete.mockResolvedValue();

      const result = await service.remove('service-id');

      expect(result).toEqual({ message: 'Service deleted successfully' });
      expect(servicesRepository.findById).toHaveBeenCalledWith('service-id');
      expect(servicesRepository.delete).toHaveBeenCalledWith('service-id');
    });

    it('should throw NotFoundException if service not found', async () => {
      servicesRepository.findById.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findFeatured', () => {
    it('should return featured services', async () => {
      const featuredServices = [{ ...mockService, is_featured: true }];
      servicesRepository.findFeatured.mockResolvedValue(featuredServices as ServiceEntity[]);

      const result = await service.findFeatured();

      expect(result).toEqual(expect.any(Array));
      expect(servicesRepository.findFeatured).toHaveBeenCalled();
    });
  });

  describe('findByTags', () => {
    it('should return services by tags', async () => {
      const tags = ['corporate', 'legal'];
      const services = [mockService as ServiceEntity];
      servicesRepository.findByTags.mockResolvedValue(services);

      const result = await service.findByTags(tags);

      expect(result).toEqual(expect.any(Array));
      expect(servicesRepository.findByTags).toHaveBeenCalledWith(tags);
    });
  });

  describe('createProcessStep', () => {
    it('should create process step successfully', async () => {
      const createProcessStepDto: CreateProcessStepDto = {
        title: 'Initial Consultation',
        description: 'We will discuss your legal needs and provide initial advice',
        step_order: 1,
        icon_url: 'https://example.com/step-icon.svg',
        duration_hours: 1,
        service_id: 'service-id',
      };

      servicesRepository.createProcessStep.mockResolvedValue(mockProcessStep as any);

      const result = await service.createProcessStep(createProcessStepDto);

      expect(result).toEqual(mockProcessStep);
      expect(servicesRepository.createProcessStep).toHaveBeenCalledWith(createProcessStepDto);
    });
  });

  describe('findProcessStepsByServiceId', () => {
    it('should return process steps for service', async () => {
      const processSteps = [mockProcessStep];
      servicesRepository.findProcessStepsByServiceId.mockResolvedValue(processSteps as any);

      const result = await service.findProcessStepsByServiceId('service-id');

      expect(result).toEqual(processSteps);
      expect(servicesRepository.findProcessStepsByServiceId).toHaveBeenCalledWith('service-id');
    });
  });

  describe('reorderProcessSteps', () => {
    it('should reorder process steps successfully', async () => {
      const stepOrders = [
        { id: 'step-id', step_order: 2 },
      ];

      servicesRepository.findById.mockResolvedValue(mockService as ServiceEntity);
      servicesRepository.reorderProcessSteps.mockResolvedValue();

      const result = await service.reorderProcessSteps('service-id', stepOrders);

      expect(result).toEqual({ message: 'Process steps reordered successfully' });
      expect(servicesRepository.findById).toHaveBeenCalledWith('service-id');
      expect(servicesRepository.reorderProcessSteps).toHaveBeenCalledWith('service-id', stepOrders);
    });

    it('should throw NotFoundException if service not found', async () => {
      const stepOrders = [{ id: 'step-1', step_order: 1 }];

      servicesRepository.findById.mockResolvedValue(null);

      await expect(service.reorderProcessSteps('invalid-id', stepOrders)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid step IDs', async () => {
      const stepOrders = [{ id: 'invalid-step', step_order: 1 }];

      servicesRepository.findById.mockResolvedValue(mockService as ServiceEntity);

      await expect(service.reorderProcessSteps('service-id', stepOrders)).rejects.toThrow(BadRequestException);
    });
  });
});
