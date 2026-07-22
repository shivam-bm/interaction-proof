import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import type { SpawnSyncOptionsWithStringEncoding } from "node:child_process";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillRoot = path.join(repositoryRoot, "skills", "interaction-proof");
const runScript = (
  script: string,
  args: string[] = [],
  options: Partial<SpawnSyncOptionsWithStringEncoding> = {}
) =>
  spawnSync(process.execPath, [path.join(skillRoot, "scripts", script), ...args], {
    cwd: repositoryRoot,
    encoding: "utf8",
    ...options,
  });

test("detect-environment reports the React Native fixture stack", () => {
  const result = runScript("detect-environment.ts", [
    "--root",
    path.join(repositoryRoot, "fixtures", "mock-app"),
  ]);
  assert.equal(result.status, 0, result.stderr);
  const environment = JSON.parse(result.stdout) as {
    configFiles: string[];
    packageName: string;
    versions: Record<string, string>;
  };
  assert.equal(environment.packageName, "interaction-proof-mock-app");
  assert.equal(environment.versions.expo, "~55.0.0");
  assert.equal(environment.versions["react-native-reanimated"], "~4.3.0");
  assert.deepEqual(environment.configFiles, ["app.json"]);
});

test("create-ledger emits every experience domain", () => {
  const result = runScript("create-ledger.ts", [
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
  const ledger = JSON.parse(result.stdout) as {
    ledger: Array<{ status: string }>;
    scope: string;
  };
  assert.equal(ledger.scope, "release");
  assert.equal(ledger.ledger.length, 13);
  assert.ok(ledger.ledger.every((entry) => entry.status === "UNASSESSED"));
});

test("validate-verdict accepts a proof-compatible report", () => {
  const result = runScript("validate-verdict.ts", [
    path.join(repositoryRoot, "fixtures", "valid-verdict.json"),
  ]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /VALID verdict \(3 claims\)/u);
});

test("validate-verdict rejects a runtime pass based only on source", () => {
  const result = runScript("validate-verdict.ts", [
    path.join(repositoryRoot, "fixtures", "invalid-verdict.json"),
  ]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /cannot pass a runtime claim at SOURCE proof/u);
  assert.match(result.stderr, /evidence is required for PASS/u);
});

test("redact-evidence removes common secrets and personal data", () => {
  const source = path.join(repositoryRoot, "fixtures", "sensitive-evidence.txt");
  const result = runScript("redact-evidence.ts", [source]);
  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(result.stdout, /jane@example\.com/u);
  assert.doesNotMatch(result.stdout, /super-secret-value/u);
  assert.doesNotMatch(result.stdout, /visible-token/u);
  assert.match(result.stdout, /\[REDACTED_EMAIL\]/u);
  assert.match(result.stdout, /\[REDACTED_SECRET\]/u);
});

test("fixture content is stable and runtime dependency-free", () => {
  const packageJson = JSON.parse(
    readFileSync(path.join(repositoryRoot, "package.json"), "utf8")
  ) as Record<string, unknown>;
  assert.equal(packageJson.private, true);
  assert.equal(packageJson.type, "module");
  assert.equal(packageJson.dependencies, undefined);
  assert.deepEqual(Object.keys(packageJson.devDependencies as Record<string, string>).sort(), [
    "@types/node",
    "typescript",
  ]);
});
