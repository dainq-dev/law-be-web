import { DataSource } from 'typeorm';
import { AppDataSource } from '../src/config/database/typeorm.config';

let dataSource: DataSource;

beforeAll(async () => {
  dataSource = new DataSource(AppDataSource);
  await dataSource.initialize();
});

afterAll(async () => {
  if (dataSource) {
    await dataSource.destroy();
  }
});

beforeEach(async () => {
  // Clean up database before each test
  if (dataSource) {
    const entities = dataSource.entityMetadatas;
    
    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name);
      await repository.query(`DELETE FROM "${entity.tableName}"`);
    }
  }
});
