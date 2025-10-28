import { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '..',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/**/*.spec.ts',
    '!src/**/*.interface.ts',
    '!src/**/*.dto.ts',
    '!src/**/*.entity.ts',
    '!src/main.ts',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@module/(.*)$': '<rootDir>/src/module/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
  },
  // setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  testTimeout: 30000,
  maxWorkers: 1,
  forceExit: true,
  detectOpenHandles: true,
};

export default config;
