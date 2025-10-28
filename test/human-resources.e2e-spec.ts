import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../src/config/database/typeorm.config';

describe('Human Resources (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let accessToken: string;

  beforeAll(async () => {
    dataSource = new DataSource(AppDataSource);
    await dataSource.initialize();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login to get access token
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        user_email: 'admin@lawcompany.com',
        password: 'admin123',
      });

    accessToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  describe('/human-resources (POST)', () => {
    it('should create human resource successfully', () => {
      return request(app.getHttpServer())
        .post('/api/human-resources')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          first_name: 'John',
          last_name: 'Doe',
          position: 'Senior Lawyer',
          email: 'john.doe@lawcompany.com',
          phone_number: '+1234567890',
          about: 'Experienced corporate lawyer',
          location: 'New York, NY',
          department: 'Corporate Law',
          company_id: 'company-id',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('full_name', 'John Doe');
          expect(res.body).toHaveProperty('position', 'Senior Lawyer');
          expect(res.body).toHaveProperty('email', 'john.doe@lawcompany.com');
        });
    });

    it('should return 400 for missing required fields', () => {
      return request(app.getHttpServer())
        .post('/api/human-resources')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          first_name: 'John',
          // missing last_name, position, email, company_id
        })
        .expect(400);
    });

    it('should return 401 without token', () => {
      return request(app.getHttpServer())
        .post('/api/human-resources')
        .send({
          first_name: 'John',
          last_name: 'Doe',
          position: 'Senior Lawyer',
          email: 'john.doe@lawcompany.com',
          company_id: 'company-id',
        })
        .expect(401);
    });
  });

  describe('/human-resources (GET)', () => {
    it('should return paginated human resources', () => {
      return request(app.getHttpServer())
        .get('/api/human-resources')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ page: 1, limit: 10 })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('page', 1);
          expect(res.body).toHaveProperty('limit', 10);
          expect(res.body).toHaveProperty('totalPages');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should return 401 without token', () => {
      return request(app.getHttpServer())
        .get('/api/human-resources')
        .expect(401);
    });
  });

  describe('/human-resources/featured (GET)', () => {
    it('should return featured human resources', () => {
      return request(app.getHttpServer())
        .get('/api/human-resources/featured')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/human-resources/:id (GET)', () => {
    let humanResourceId: string;

    beforeAll(async () => {
      // Create a human resource first
      const createResponse = await request(app.getHttpServer())
        .post('/api/human-resources')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          first_name: 'Jane',
          last_name: 'Smith',
          position: 'Partner',
          email: 'jane.smith@lawcompany.com',
          company_id: 'company-id',
        });

      humanResourceId = createResponse.body.id;
    });

    it('should return human resource by id', () => {
      return request(app.getHttpServer())
        .get(`/api/human-resources/${humanResourceId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', humanResourceId);
          expect(res.body).toHaveProperty('full_name', 'Jane Smith');
        });
    });

    it('should return 404 for non-existent human resource', () => {
      return request(app.getHttpServer())
        .get('/api/human-resources/non-existent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('/human-resources/:id (PATCH)', () => {
    let humanResourceId: string;

    beforeAll(async () => {
      // Create a human resource first
      const createResponse = await request(app.getHttpServer())
        .post('/api/human-resources')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          first_name: 'Bob',
          last_name: 'Johnson',
          position: 'Associate',
          email: 'bob.johnson@lawcompany.com',
          company_id: 'company-id',
        });

      humanResourceId = createResponse.body.id;
    });

    it('should update human resource successfully', () => {
      return request(app.getHttpServer())
        .patch(`/api/human-resources/${humanResourceId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          position: 'Senior Associate',
          about: 'Updated about information',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', humanResourceId);
          expect(res.body).toHaveProperty('position', 'Senior Associate');
        });
    });
  });

  describe('/human-resources/:id (DELETE)', () => {
    let humanResourceId: string;

    beforeAll(async () => {
      // Create a human resource first
      const createResponse = await request(app.getHttpServer())
        .post('/api/human-resources')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          first_name: 'Alice',
          last_name: 'Brown',
          position: 'Junior Lawyer',
          email: 'alice.brown@lawcompany.com',
          company_id: 'company-id',
        });

      humanResourceId = createResponse.body.id;
    });

    it('should delete human resource successfully', () => {
      return request(app.getHttpServer())
        .delete(`/api/human-resources/${humanResourceId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message', 'Human resource deleted successfully');
        });
    });
  });
});
