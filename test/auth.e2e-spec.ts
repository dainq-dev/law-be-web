import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../src/config/database/typeorm.config';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = new DataSource(AppDataSource);
    await dataSource.initialize();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  describe('/auth/login (POST)', () => {
    it('should login successfully with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          user_email: 'admin@lawcompany.com',
          password: 'admin123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('refresh_token');
          expect(res.body).toHaveProperty('expires_in');
          expect(res.body).toHaveProperty('admin');
        });
    });

    it('should return 401 for invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          user_email: 'invalid@email.com',
          password: 'wrong-password',
        })
        .expect(401);
    });

    it('should return 400 for missing required fields', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          user_email: 'admin@lawcompany.com',
          // missing password
        })
        .expect(400);
    });
  });

  describe('/auth/refresh (POST)', () => {
    let refreshToken: string;

    beforeAll(async () => {
      // First login to get refresh token
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          user_email: 'admin@lawcompany.com',
          password: 'admin123',
        });

      refreshToken = loginResponse.body.refresh_token;
    });

    it('should refresh token successfully', () => {
      return request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({
          refresh_token: refreshToken,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('refresh_token');
          expect(res.body).toHaveProperty('expires_in');
        });
    });

    it('should return 401 for invalid refresh token', () => {
      return request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({
          refresh_token: 'invalid-refresh-token',
        })
        .expect(401);
    });
  });

  describe('/auth/profile (GET)', () => {
    let accessToken: string;

    beforeAll(async () => {
      // First login to get access token
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          user_email: 'admin@lawcompany.com',
          password: 'admin123',
        });

      accessToken = loginResponse.body.access_token;
    });

    it('should get profile successfully with valid token', () => {
      return request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('user_email');
          expect(res.body).toHaveProperty('full_name');
        });
    });

    it('should return 401 without token', () => {
      return request(app.getHttpServer())
        .get('/api/auth/profile')
        .expect(401);
    });

    it('should return 401 with invalid token', () => {
      return request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('/auth/logout (POST)', () => {
    let accessToken: string;

    beforeAll(async () => {
      // First login to get access token
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          user_email: 'admin@lawcompany.com',
          password: 'admin123',
        });

      accessToken = loginResponse.body.access_token;
    });

    it('should logout successfully', () => {
      return request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message', 'Logged out successfully');
        });
    });
  });
});
