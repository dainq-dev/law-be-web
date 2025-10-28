import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export class TestHelper {
  static async loginAsAdmin(app: INestApplication): Promise<string> {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        user_email: 'admin@lawcompany.com',
        password: 'admin123',
      });

    if (response.status !== 200) {
      throw new Error('Failed to login as admin');
    }

    return response.body.access_token;
  }

  static async createTestHumanResource(
    app: INestApplication,
    accessToken: string,
    data: any = {},
  ) {
    const defaultData = {
      first_name: 'Test',
      last_name: 'User',
      position: 'Test Position',
      email: 'test@example.com',
      company_id: 'test-company-id',
      ...data,
    };

    return request(app.getHttpServer())
      .post('/api/human-resources')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(defaultData);
  }

  static async createTestService(
    app: INestApplication,
    accessToken: string,
    data: any = {},
  ) {
    const defaultData = {
      name: 'Test Service',
      description: 'Test service description',
      short_description: 'Test short description',
      price: 100,
      currency: 'USD',
      company_id: 'test-company-id',
      ...data,
    };

    return request(app.getHttpServer())
      .post('/api/services')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(defaultData);
  }

  static async createTestContact(
    app: INestApplication,
    data: any = {},
  ) {
    const defaultData = {
      full_name: 'Test Contact',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'Test message',
      ...data,
    };

    return request(app.getHttpServer())
      .post('/api/contact')
      .send(defaultData);
  }

  static async cleanupDatabase(app: INestApplication) {
    // This would be implemented based on your database cleanup needs
    // For now, we'll rely on the setup.ts file to handle cleanup
  }
}
