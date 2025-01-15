import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: Config = {
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>',
  }),
  moduleFileExtensions: ['js', 'json', 'ts'],
  roots: ['<rootDir>/src/', '<rootDir>/test/'],
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  testRegex: '.*\\.spec\\.ts$',
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    'index.ts',
    '.entity.ts',
    '.dto.ts',
    '.params.ts',
    '.module.ts',
    '.config.ts',
    '.constants.ts',
    '.schema.d.ts',
    'main.ts',
  ],
  coverageReporters: ['html-spa'],
};

export default config;
