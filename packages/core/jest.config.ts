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
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>../../../' }),
};
export default config;