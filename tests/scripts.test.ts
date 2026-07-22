import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import type { SpawnSyncOptionsWithStringEncoding } from "node:child_process";

type JsonObject = Record<string, unknown>;

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillRoot = path.join(repositoryRoot, "skills", "interaction-proof");
const validFixturePath = path.join(repositoryRoot, "fixtures", "valid-verdict.json");

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

const readValidFixture = (): JsonObject =>
  JSON.parse(readFileSync(validFixturePath, "utf8")) as JsonObject;

const validateReport = (report: JsonObject) => {
  const directory = mkdtempSync(path.join(tmpdir(), "interaction-proof-test-"));
  const reportPath = path.join(directory, "report.json");
  try {
    writeFileSync(reportPath, JSON.stringify(report));
    return runScript("validate-verdict.ts", [reportPath]);
  } finally {
    rmSync(directory, { force: true, recursive: true });
  }
};

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

test("create-ledger emits the canonical claim contract", () => {
  const result = runScript("create-ledger.ts", [
    "--scope",
    "release",
    "--surface",
    "Account",
    "--platform",
    "ios",
    "--person",
    "Field representative",
    "--task",
    "Open Account",
    "--proof-target",
    "DEVICE",
  ]);
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout) as {
    audit: { scope: string; status: string };
    coverage: { excludedDomains: unknown[]; excludedEnvironments: unknown[] };
    environments: Array<{ id: string; riskRationale: string }>;
    ledger: Array<Record<string, unknown>>;
  };
  assert.equal(report.audit.scope, "release");
  assert.equal(report.audit.status, "UNASSESSED");
  assert.deepEqual(report.environments.map(({ id }) => id), ["ios-primary"]);
  assert.match(report.environments[0]?.riskRationale ?? "", /^TODO:/u);
  assert.deepEqual(report.coverage, { excludedDomains: [], excludedEnvironments: [] });
  assert.equal(report.ledger.length, 13);

  const canonicalFields = [
    "id",
    "domain",
    "claimType",
    "critical",
    "person",
    "task",
    "entryState",
    "action",
    "feedback",
    "completion",
    "cancellation",
    "recovery",
    "alternative",
    "environmentId",
    "claim",
    "expected",
    "observed",
    "status",
    "proofTarget",
    "proofLevel",
    "evidence",
    "reproduction",
    "confidence",
  ];
  for (const entry of report.ledger) {
    assert.deepEqual(Object.keys(entry), canonicalFields);
    assert.equal(entry.person, "Field representative");
    assert.equal(entry.task, "Open Account");
    assert.equal(entry.status, "UNASSESSED");
  }
});

test("create-ledger markdown exposes every interaction field", () => {
  const result = runScript("create-ledger.ts", ["--output", "markdown"]);
  assert.equal(result.status, 0, result.stderr);
  for (const field of [
    "entryState",
    "feedback",
    "completion",
    "cancellation",
    "recovery",
    "alternative",
    "proofTarget",
    "proofLevel",
  ]) {
    assert.match(result.stdout, new RegExp(`\\| ${field} \\|`, "u"));
  }
});

test("create-ledger scopes claims and seeds omitted-domain rationales", () => {
  const result = runScript("create-ledger.ts", ["--domains", "task,accessibility"]);
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout) as {
    coverage: { excludedDomains: Array<{ domain: string; reason: string }> };
    ledger: Array<{ domain: string }>;
  };
  assert.deepEqual(report.ledger.map(({ domain }) => domain), ["task", "accessibility"]);
  assert.equal(report.coverage.excludedDomains.length, 11);
  assert.ok(report.coverage.excludedDomains.every(({ reason }) => reason.startsWith("TODO:")));
});

test("validate-verdict accepts a proof-compatible report", () => {
  const result = runScript("validate-verdict.ts", [validFixturePath]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /VALID verdict \(3 claims\)/u);
});

test("validate-verdict rejects source-only runtime resolution", () => {
  const result = runScript("validate-verdict.ts", [
    path.join(repositoryRoot, "fixtures", "invalid-verdict.json"),
  ]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /cannot resolve a runtime claim at SOURCE proof/u);
  assert.match(result.stderr, /proofLevel must meet or exceed proofTarget/u);
  assert.match(result.stderr, /evidence must contain at least one item/u);
  assert.match(result.stderr, /reproduction must contain at least one item/u);
});

test("validate-verdict rejects an incomplete canonical claim", () => {
  const report = readValidFixture();
  const firstClaim = (report.ledger as JsonObject[])[0];
  assert.ok(firstClaim);
  delete firstClaim.cancellation;
  const result = validateReport(report);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /ledger\[0\]\.cancellation must be a non-empty string/u);
});

test("validate-verdict requires every experience domain or an exclusion", () => {
  const report = readValidFixture();
  const coverage = report.coverage as JsonObject;
  coverage.excludedDomains = [];
  const result = validateReport(report);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /coverage must account for the navigation domain/u);
});

test("validate-verdict blocks release passes with critical blockers", () => {
  const report = readValidFixture();
  const audit = report.audit as JsonObject;
  audit.scope = "release";
  audit.status = "PASS";
  const firstClaim = (report.ledger as JsonObject[])[0];
  assert.ok(firstClaim);
  firstClaim.status = "BLOCKED";
  firstClaim.blocker = "A physical device is unavailable";
  firstClaim.evidence = [];
  report.ledger = [firstClaim];
  const coverage = report.coverage as JsonObject;
  const excludedDomains = coverage.excludedDomains as JsonObject[];
  excludedDomains.push(
    { domain: "task", reason: "Not part of this release fixture" },
    { domain: "system", reason: "Not part of this release fixture" }
  );
  report.summary = {
    PASS: 0,
    FAIL: 0,
    BLOCKED: 1,
    NOT_APPLICABLE: 0,
    HUMAN_STUDY_REQUIRED: 0,
  };
  const result = validateReport(report);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /release audit cannot PASS while a critical claim is BLOCKED/u);
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

test("repository remains runtime dependency-free", () => {
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
