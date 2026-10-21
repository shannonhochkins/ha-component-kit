import path from "node:path";
import type { JestConfigWithTsJest } from "ts-jest";
import base from "./jest.config";

/** Exercise the public CommonJS build (or extracted npm tarball), rather than source aliases. */
const config: JestConfigWithTsJest = {
  ...base,
  displayName: "published-core",
  collectCoverage: false,
  testMatch: ["**/useDishwasher/useDishwasher.test.tsx"],
  moduleNameMapper: {
    "^@core$": process.env.HAKIT_TEST_PACKAGE_ROOT
      ? path.resolve(process.env.HAKIT_TEST_PACKAGE_ROOT, "dist/cjs/index.js")
      : "<rootDir>/../dist/cjs/index.js",
  },
};
export default config;
