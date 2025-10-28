import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../src/config/database/typeorm.config';

describe('Contact (e2e)', () => {
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

    // Login to get access token for admin endpoints
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

  describe('/contact (POST)', () => {
    it('should submit contact form successfully', () => {
      return request(app.getHttpServer())
        .post('/api/contact')
        .send({
          full_name: 'John Doe',
          email: 'john.doe@example.com',
          phone_number: '+1234567890',
          subject: 'Legal Consultation Inquiry',
          message: 'I would like to schedule a consultation for corporate law matters.',
          company_name: 'ABC Corporation',
          preferred_contact_method: 'email',
          urgency_level: 'medium',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('full_name', 'John Doe');
          expect(res.body).toHaveProperty('email', 'john.doe@example.com');
          expect(res.body).toHaveProperty('subject', 'Legal Consultation Inquiry');
          expect(res.body).toHaveProperty('status', 'new');
          expect(res.body).toHaveProperty('is_read', false);
        });
    });

    it('should return 400 for missing required fields', () => {
      return request(app.getHttpServer())
        .post('/api/contact')
        .send({
          full_name: 'John Doe',
          // missing email, subject, message
        })
        .expect(400);
    });

    it('should return 400 for invalid email format', () => {
      return request(app.getHttpServer())
        .post('/api/contact')
        .send({
          full_name: 'John Doe',
          email: 'invalid-email',
          subject: 'Test Subject',
          message: 'Test message',
        })
        .expect(400);
    });
  });

  describe('/contact (GET) - Admin only', () => {
    it('should return paginated contacts for admin', () => {
      return request(app.getHttpServer())
        .get('/api/contact')
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
        .get('/api/contact')
        .expect(401);
    });

    it('should filter by status', () => {
      return request(app.getHttpServer())
        .get('/api/contact')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ status: 'new' })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.every((contact: any) => contact.status === 'new')).toBe(true);
        });
    });
  });

  describe('/contact/stats (GET) - Admin only', () => {
    it('should return contact statistics', () => {
      return request(app.getHttpServer())
        .get('/api/contact/stats')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('unread');
          expect(res.body).toHaveProperty('responded');
          expect(res.body).toHaveProperty('new');
          expect(typeof res.body.total).toBe('number');
          expect(typeof res.body.unread).toBe('number');
          expect(typeof res.body.responded).toBe('number');
          expect(typeof res.body.new).toBe('number');
        });
    });
  });

  describe('/contact/:id (GET) - Admin only', () => {
    let contactId: string;

    beforeAll(async () => {
      // Create a contact first
      const createResponse = await request(app.getHttpServer())
        .post('/api/contact')
        .send({
          full_name: 'Jane Smith',
          email: 'jane.smith@example.com',
          subject: 'Test Subject',
          message: 'Test message for contact details',
        });

      contactId = createResponse.body.id;
    });

    it('should return contact by id', () => {
      return request(app.getHttpServer())
        .get(`/api/contact/${contactId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', contactId);
          expect(res.body).toHaveProperty('full_name', 'Jane Smith');
        });
    });

    it('should return 404 for non-existent contact', () => {
      return request(app.getHttpServer())
        .get('/api/contact/non-existent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('/contact/:id/read (PATCH) - Admin only', () => {
    let contactId: string;

    beforeAll(async () => {
      // Create a contact first
      const createResponse = await request(app.getHttpServer())
        .post('/api/contact')
        .send({
          full_name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          subject: 'Test Subject for Read',
          message: 'Test message for marking as read',
        });

      contactId = createResponse.body.id;
    });

    it('should mark contact as read', () => {
      return request(app.getHttpServer())
        .patch(`/api/contact/${contactId}/read`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message', 'Contact marked as read');
        });
    });
  });

  describe('/contact/:id/responded (PATCH) - Admin only', () => {
    let contactId: string;

    beforeAll(async () => {
      // Create a contact first
      const createResponse = await request(app.getHttpServer())
        .post('/api/contact')
        .send({
          full_name: 'Alice Brown',
          email: 'alice.brown@example.com',
          subject: 'Test Subject for Responded',
          message: 'Test message for marking as responded',
        });

      contactId = createResponse.body.id;
    });

    it('should mark contact as responded', () => {
      return request(app.getHttpServer())
        .patch(`/api/contact/${contactId}/responded`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          admin_notes: 'Contacted client via phone',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message', 'Contact marked as responded');
        });
    });
  });

  describe('/contact/:id (DELETE) - Admin only', () => {
    let contactId: string;

    beforeAll(async () => {
      // Create a contact first
      const createResponse = await request(app.getHttpServer())
        .post('/api/contact')
        .send({
          full_name: 'Charlie Wilson',
          email: 'charlie.wilson@example.com',
          subject: 'Test Subject for Delete',
          message: 'Test message for deletion',
        });

      contactId = createResponse.body.id;
    });

    it('should delete contact', () => {
      return request(app.getHttpServer())
        .delete(`/api/contact/${contactId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message', 'Contact deleted successfully');
        });
    });
  });
});
