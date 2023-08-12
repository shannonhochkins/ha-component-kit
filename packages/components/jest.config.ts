/** @type {import('ts-jest').JestConfigWithTsJest} */
import type { JestConfigWithTsJest } from 'ts-jest'
import { compilerOptions } from '../../tsconfig.json';
import { pathsToModuleNameMapper } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    "/dist/",
    "/node_modules/",
    "/coverage/"
  ],
  roots: ['<rootDir>'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.json',
      },
    ],
  },
  snapshotSerializers: [
    '@emotion/jest/serializer'
  ],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: {
    ...pathsToModuleNameMapper({
      ...compilerOptions.paths,
      // need to overwrite this for tests to ensure it's using the source code
      "@hakit/core": ["packages/core/src"],
    }, { prefix: '<rootDir>../../../' }),
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>../fileMock.ts'
  },
};
export default config;