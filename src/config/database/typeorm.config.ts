import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';
import { TypeOrmLoggerService } from '../../shared/services/typeorm-logger.service';
import { LoggingConfig } from '../../shared/config/logging.config';
import { 
  AdminEntity, 
  RoleEntity, 
  PermissionEntity,
  HumanResourceEntity,
  EducationEntity,
  ExperienceEntity,
  CertificateEntity,
  BlogEntity,
  PostBlockEntity,
  ServiceEntity,
  LanguageEntity,
  WebConfigEntity,
  ContactEntity,
  AttachmentsEntity,
  OtpEntity,
} from '../../shared/entities';

export const AppDataSource: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'postgres',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_DATABASE ?? process.env.PG_DB_NAME ?? 'law_company_db',
  extra: {
    max: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
    min: parseInt(process.env.DB_MIN_CONNECTIONS || '5'),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000'),
  },
  entities: [
    AdminEntity, RoleEntity, PermissionEntity, HumanResourceEntity, EducationEntity,
    ExperienceEntity, CertificateEntity, BlogEntity, PostBlockEntity,
    ServiceEntity, LanguageEntity, AttachmentsEntity,
    WebConfigEntity, ContactEntity, OtpEntity,
  ],
  migrations: ['dist/migrations/*{.ts,.js}'],
  synchronize: true,
  logging: process.env.NODE_ENV !== 'production',
};

const pgDataSource = new DataSource(AppDataSource);

export default pgDataSource;