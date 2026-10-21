import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Resolve public ESM and CJS exports in a genuine Node process without DOM shims.
// HAKIT_TEST_PACKAGE_ROOT points this same check at an extracted npm tarball.
const result = spawnSync(
  process.execPath,
  [
    "--input-type=module",
    "-e",
    `
  import assert from "node:assert/strict";
  import { createRequire } from "node:module";
  import * as constants from "@hakit/core/constants";
  const commonjs = createRequire(import.meta.url)("@hakit/core/constants");
  assert.equal("window" in globalThis, false);
  for (const name of ["ON", "OFF", "UNKNOWN", "UNAVAILABLE"]) {
    assert.equal(typeof constants[name], "string");
    assert.equal(commonjs[name], constants[name]);
  }
  assert.equal(constants.isUnavailableState(constants.UNKNOWN), true);
  assert.equal(constants.isUnavailableState(constants.ON), false);
  assert.equal(commonjs.isOffState(constants.OFF), true);
`,
  ],
  {
    cwd: process.env.HAKIT_TEST_PACKAGE_ROOT || dirname(fileURLToPath(import.meta.url)),
    encoding: "utf8",
  },
);
assert.equal(result.status, 0, result.stderr || result.stdout);
