#!/usr/bin/env node

import { readFileSync } from "node:fs";

type JsonObject = Record<string, unknown>;

const statuses = [
  "PASS",
  "FAIL",
  "BLOCKED",
  "NOT_APPLICABLE",
  "HUMAN_STUDY_REQUIRED",
] as const;
const proofLevels = ["SOURCE", "RUN", "DEVICE", "TRACE", "FIELD"] as const;
const runtimeProof = new Set(["RUN", "DEVICE", "TRACE", "FIELD"]);
const claimTypes = new Set(["source", "runtime", "human"]);
const confidences = new Set(["high", "medium", "low"]);
const severities = new Set(["BLOCKER", "HIGH", "MEDIUM", "LOW"]);
const scopes = new Set(["interaction", "surface", "journey", "release"]);
const domains = new Set([
  "task",
  "navigation",
  "gesture",
  "motion",
  "responsiveness",
  "accessibility",
  "adaptation",
  "system",
  "feedback",
  "resilience",
  "localization",
  "privacy",
  "resources",
]);
const proofRank = new Map(proofLevels.map((level, index) => [level, index]));
const environmentFields = [
  "id",
  "platform",
  "device",
  "osVersion",
  "buildType",
  "revision",
  "refreshRate",
  "dataState",
  "networkState",
  "locale",
  "appearance",
  "accessibilitySettings",
  "riskRationale",
] as const;
const claimFields = [
  "id",
  "domain",
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
] as const;

const isObject = (value: unknown): value is JsonObject =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const reportPath = process.argv[2];
if (!reportPath) {
  process.stderr.write("Usage: validate-verdict.ts <report.json>\n");
  process.exit(1);
}

let parsedReport: unknown;
try {
  parsedReport = JSON.parse(readFileSync(reportPath, "utf8")) as unknown;
} catch (error) {
  process.stderr.write(
    `Unable to read report: ${error instanceof Error ? error.message : String(error)}\n`
  );
  process.exit(1);
}

if (!isObject(parsedReport)) {
  process.stderr.write("Unable to read report: root value must be an object\n");
  process.exit(1);
}

const report = parsedReport;
const errors: string[] = [];

const requireString = (value: unknown, propertyPath: string): void => {
  if (typeof value !== "string" || value.trim() === "") {
    errors.push(`${propertyPath} must be a non-empty string`);
  }
};

const requireStringArray = (
  value: unknown,
  propertyPath: string,
  options: { nonEmpty?: boolean } = {}
): void => {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || item === "")) {
    errors.push(`${propertyPath} must be an array of non-empty strings`);
    return;
  }
  if (options.nonEmpty && value.length === 0) {
    errors.push(`${propertyPath} must contain at least one item`);
  }
};

if (report.version !== "1.0") {
  errors.push('version must equal "1.0"');
}

const audit = report.audit;
let auditScope = "";
let auditStatus = "";
if (!isObject(audit)) {
  errors.push("audit must be an object");
} else {
  auditScope = String(audit.scope);
  auditStatus = String(audit.status);
  if (!scopes.has(auditScope)) {
    errors.push("audit.scope must be interaction, surface, journey, or release");
  }
  requireString(audit.target, "audit.target");
  if (!proofLevels.includes(audit.proofTarget as (typeof proofLevels)[number])) {
    errors.push("audit.proofTarget must be a proof ladder value");
  }
  if (!statuses.includes(audit.status as (typeof statuses)[number])) {
    errors.push("audit.status must be a final outcome");
  }
}

const rawEnvironments = Array.isArray(report.environments) ? report.environments : [];
if (rawEnvironments.length === 0) {
  errors.push("environments must contain at least one environment");
}

const environmentIds = new Set<unknown>();
for (const [index, rawEnvironment] of rawEnvironments.entries()) {
  const prefix = `environments[${index}]`;
  const environment = isObject(rawEnvironment) ? rawEnvironment : {};
  for (const field of environmentFields) {
    requireString(environment[field], `${prefix}.${field}`);
  }
  if (environmentIds.has(environment.id)) {
    errors.push(`${prefix}.id must be unique`);
  }
  environmentIds.add(environment.id);
}

const ledger = Array.isArray(report.ledger) ? report.ledger : [];
if (ledger.length === 0) {
  errors.push("ledger must contain at least one claim");
}

const counts: Record<(typeof statuses)[number], number> = {
  PASS: 0,
  FAIL: 0,
  BLOCKED: 0,
  NOT_APPLICABLE: 0,
  HUMAN_STUDY_REQUIRED: 0,
};
const seenIds = new Set<unknown>();
const coveredDomains = new Set<string>();
let hasCriticalBlocker = false;

for (const [index, rawEntry] of ledger.entries()) {
  const prefix = `ledger[${index}]`;
  const entry = isObject(rawEntry) ? rawEntry : {};

  for (const field of claimFields) {
    requireString(entry[field], `${prefix}.${field}`);
  }
  if (seenIds.has(entry.id)) {
    errors.push(`${prefix}.id must be unique`);
  }
  seenIds.add(entry.id);

  if (!claimTypes.has(String(entry.claimType))) {
    errors.push(`${prefix}.claimType must be source, runtime, or human`);
  }
  if (!domains.has(String(entry.domain))) {
    errors.push(`${prefix}.domain must be a recognized experience domain`);
  } else {
    coveredDomains.add(String(entry.domain));
  }
  if (typeof entry.critical !== "boolean") {
    errors.push(`${prefix}.critical must be a boolean`);
  }
  if (!environmentIds.has(entry.environmentId)) {
    errors.push(`${prefix}.environmentId must reference environments[].id`);
  }

  const status = entry.status;
  if (!statuses.includes(status as (typeof statuses)[number])) {
    errors.push(`${prefix}.status must be a final outcome`);
  } else {
    counts[status as (typeof statuses)[number]] += 1;
  }

  const proofTarget = entry.proofTarget;
  const proofLevel = entry.proofLevel;
  if (!proofLevels.includes(proofTarget as (typeof proofLevels)[number])) {
    errors.push(`${prefix}.proofTarget must be a proof ladder value`);
  }
  if (!proofLevels.includes(proofLevel as (typeof proofLevels)[number])) {
    errors.push(`${prefix}.proofLevel must be a proof ladder value`);
  }
  if (!confidences.has(String(entry.confidence))) {
    errors.push(`${prefix}.confidence must be high, medium, or low`);
  }

  requireStringArray(entry.evidence, `${prefix}.evidence`, {
    nonEmpty: status === "PASS" || status === "FAIL",
  });
  requireStringArray(entry.reproduction, `${prefix}.reproduction`, { nonEmpty: true });

  if (status === "PASS" || status === "FAIL") {
    const targetRank = proofRank.get(proofTarget as (typeof proofLevels)[number]);
    const achievedRank = proofRank.get(proofLevel as (typeof proofLevels)[number]);
    if (targetRank !== undefined && achievedRank !== undefined && achievedRank < targetRank) {
      errors.push(`${prefix}.proofLevel must meet or exceed proofTarget for ${status}`);
    }
  }

  if (
    entry.claimType === "runtime" &&
    (status === "PASS" || status === "FAIL") &&
    !runtimeProof.has(String(proofLevel))
  ) {
    errors.push(`${prefix} cannot resolve a runtime claim at SOURCE proof`);
  }
  if (entry.claimType === "human" && status !== "HUMAN_STUDY_REQUIRED") {
    errors.push(`${prefix} human claims must use HUMAN_STUDY_REQUIRED`);
  }
  if (status === "FAIL" && !severities.has(String(entry.severity))) {
    errors.push(`${prefix}.severity is required for failures`);
  }
  if (status === "BLOCKED") {
    requireString(entry.blocker, `${prefix}.blocker`);
    hasCriticalBlocker ||= entry.critical === true;
  }
  if (status === "NOT_APPLICABLE") {
    requireString(entry.reason, `${prefix}.reason`);
  }
  if (status === "HUMAN_STUDY_REQUIRED") {
    requireString(entry.studyQuestion, `${prefix}.studyQuestion`);
  }
}

const coverage = report.coverage;
if (!isObject(coverage)) {
  errors.push("coverage must be an object");
} else {
  const excludedDomains = Array.isArray(coverage.excludedDomains)
    ? coverage.excludedDomains
    : [];
  if (!Array.isArray(coverage.excludedDomains)) {
    errors.push("coverage.excludedDomains must be an array");
  }
  for (const [index, rawExclusion] of excludedDomains.entries()) {
    const prefix = `coverage.excludedDomains[${index}]`;
    const exclusion = isObject(rawExclusion) ? rawExclusion : {};
    requireString(exclusion.domain, `${prefix}.domain`);
    requireString(exclusion.reason, `${prefix}.reason`);
    const domain = String(exclusion.domain);
    if (!domains.has(domain)) {
      errors.push(`${prefix}.domain must be a recognized experience domain`);
    }
    if (coveredDomains.has(domain)) {
      errors.push(`${prefix}.domain is already represented in ledger`);
    }
    coveredDomains.add(domain);
  }

  const excludedEnvironments = Array.isArray(coverage.excludedEnvironments)
    ? coverage.excludedEnvironments
    : [];
  if (!Array.isArray(coverage.excludedEnvironments)) {
    errors.push("coverage.excludedEnvironments must be an array");
  }
  for (const [index, rawExclusion] of excludedEnvironments.entries()) {
    const prefix = `coverage.excludedEnvironments[${index}]`;
    const exclusion = isObject(rawExclusion) ? rawExclusion : {};
    requireString(exclusion.combination, `${prefix}.combination`);
    requireString(exclusion.reason, `${prefix}.reason`);
  }
}

for (const domain of domains) {
  if (!coveredDomains.has(domain)) {
    errors.push(`coverage must account for the ${domain} domain`);
  }
}

const summary = report.summary;
if (!isObject(summary)) {
  errors.push("summary must be an object");
} else {
  for (const status of statuses) {
    if (summary[status] !== counts[status]) {
      errors.push(`summary.${status} must equal ${counts[status]}`);
    }
  }
}

if (auditStatus === "PASS" && counts.FAIL > 0) {
  errors.push("audit.status cannot be PASS while claims are FAIL");
}
if (auditScope === "release" && auditStatus === "PASS" && hasCriticalBlocker) {
  errors.push("a release audit cannot PASS while a critical claim is BLOCKED");
}

if (errors.length > 0) {
  process.stderr.write(
    `INVALID verdict (${errors.length} issue${errors.length === 1 ? "" : "s"})\n`
  );
  for (const error of errors) {
    process.stderr.write(`- ${error}\n`);
  }
  process.exit(1);
}

process.stdout.write(
  `VALID verdict (${ledger.length} claim${ledger.length === 1 ? "" : "s"})\n`
);
