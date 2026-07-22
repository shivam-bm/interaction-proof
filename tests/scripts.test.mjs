import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillRoot = path.join(repositoryRoot, "skills", "interaction-proof");
const runScript = (script, args = [], options = {}) =>
  spawnSync(process.execPath, [path.join(skillRoot, "scripts", script), ...args], {
    cwd: repositoryRoot,
    encoding: "utf8",
    ...options,
  });

test("detect-environment reports the React Native fixture stack", () => {
  const result = runScript("detect-environment.mjs", [
    "--root",
    path.join(repositoryRoot, "fixtures", "mock-app"),
  ]);
  assert.equal(result.status, 0, result.stderr);
  const environment = JSON.parse(result.stdout);
  assert.equal(environment.packageName, "interaction-proof-mock-app");
  assert.equal(environment.versions.expo, "~55.0.0");
  assert.equal(environment.versions["react-native-reanimated"], "~4.3.0");
  assert.deepEqual(environment.configFiles, ["app.json"]);
});

test("create-ledger emits every experience domain", () => {
  const result = runScript("create-ledger.mjs", [
    "--scope",
    "release",
    "--surface",
    "Account",
    "--platform",
    "ios",
    "--proof-target",
    "DEVICE",
  ]);
  assert.equal(result.status, 0, result.stderr);
  const ledger = JSON.parse(result.stdout);
  assert.equal(ledger.scope, "release");
  assert.equal(ledger.ledger.length, 13);
  assert.ok(ledger.ledger.every((entry) => entry.status === "UNASSESSED"));
});

test("validate-verdict accepts a proof-compatible report", () => {
  const result = runScript("validate-verdict.mjs", [
    path.join(repositoryRoot, "fixtures", "valid-verdict.json"),
  ]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /VALID verdict \(3 claims\)/u);
});

test("validate-verdict rejects a runtime pass based only on source", () => {
  const result = runScript("validate-verdict.mjs", [
    path.join(repositoryRoot, "fixtures", "invalid-verdict.json"),
  ]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /cannot pass a runtime claim at SOURCE proof/u);
  assert.match(result.stderr, /evidence is required for PASS/u);
});

test("redact-evidence removes common secrets and personal data", () => {
  const source = path.join(repositoryRoot, "fixtures", "sensitive-evidence.txt");
  const result = runScript("redact-evidence.mjs", [source]);
  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(result.stdout, /jane@example\.com/u);
  assert.doesNotMatch(result.stdout, /super-secret-value/u);
  assert.doesNotMatch(result.stdout, /visible-token/u);
  assert.match(result.stdout, /\[REDACTED_EMAIL\]/u);
  assert.match(result.stdout, /\[REDACTED_SECRET\]/u);
});

test("fixture content is stable and dependency-free", () => {
  const packageJson = JSON.parse(readFileSync(path.join(repositoryRoot, "package.json"), "utf8"));
  assert.equal(packageJson.private, true);
  assert.equal(packageJson.type, "module");
  assert.equal(packageJson.dependencies, undefined);
  assert.equal(packageJson.devDependencies, undefined);
});
