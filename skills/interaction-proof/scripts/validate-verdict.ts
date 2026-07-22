#!/usr/bin/env node

import { readFileSync } from "node:fs";

type JsonObject = Record<string, unknown>;

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

const requireString = (value: unknown, propertyPath: string): void => {
  if (typeof value !== "string" || value.trim() === "") {
    errors.push(`${propertyPath} must be a non-empty string`);
  }
};

if (report.version !== "1.0") {
  errors.push('version must equal "1.0"');
}

const audit = report.audit;
if (!isObject(audit)) {
  errors.push("audit must be an object");
} else {
  if (!scopes.has(String(audit.scope))) {
    errors.push("audit.scope must be interaction, surface, journey, or release");
  }
  requireString(audit.target, "audit.target");
  if (!proofLevels.includes(audit.proofTarget as (typeof proofLevels)[number])) {
    errors.push("audit.proofTarget must be a proof ladder value");
  }
}

const environment = report.environment;
if (!isObject(environment)) {
  errors.push("environment must be an object");
} else {
  for (const field of ["platform", "device", "osVersion", "buildType", "revision"]) {
    requireString(environment[field], `environment.${field}`);
  }
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

for (const [index, rawEntry] of ledger.entries()) {
  const prefix = `ledger[${index}]`;
  const entry = isObject(rawEntry) ? rawEntry : {};
  requireString(entry.id, `${prefix}.id`);
  if (seenIds.has(entry.id)) {
    errors.push(`${prefix}.id must be unique`);
  }
  seenIds.add(entry.id);

  if (!claimTypes.has(String(entry.claimType))) {
    errors.push(`${prefix}.claimType must be source, runtime, or human`);
  }
  for (const field of ["claim", "expected", "observed", "environmentId"]) {
    requireString(entry[field], `${prefix}.${field}`);
  }

  const status = entry.status;
  if (!statuses.includes(status as (typeof statuses)[number])) {
    errors.push(`${prefix}.status is invalid`);
  } else {
    counts[status as (typeof statuses)[number]] += 1;
  }

  const proofLevel = entry.proofLevel;
  if (!proofLevels.includes(proofLevel as (typeof proofLevels)[number])) {
    errors.push(`${prefix}.proofLevel is invalid`);
  }
  if (!confidences.has(String(entry.confidence))) {
    errors.push(`${prefix}.confidence must be high, medium, or low`);
  }
  if (!Array.isArray(entry.reproduction) || entry.reproduction.length === 0) {
    errors.push(`${prefix}.reproduction must contain at least one step`);
  }

  if ((status === "PASS" || status === "FAIL") &&
      (!Array.isArray(entry.evidence) || entry.evidence.length === 0)) {
    errors.push(`${prefix}.evidence is required for ${status}`);
  }
  if (
    entry.claimType === "runtime" &&
    status === "PASS" &&
    !runtimeProof.has(String(proofLevel))
  ) {
    errors.push(`${prefix} cannot pass a runtime claim at SOURCE proof`);
  }
  if (entry.claimType === "human" && status !== "HUMAN_STUDY_REQUIRED") {
    errors.push(`${prefix} human claims must use HUMAN_STUDY_REQUIRED`);
  }
  if (status === "FAIL" && !severities.has(String(entry.severity))) {
    errors.push(`${prefix}.severity is required for failures`);
  }
  if (status === "BLOCKED") {
    requireString(entry.blocker, `${prefix}.blocker`);
  }
  if (status === "NOT_APPLICABLE") {
    requireString(entry.reason, `${prefix}.reason`);
  }
  if (status === "HUMAN_STUDY_REQUIRED") {
    requireString(entry.studyQuestion, `${prefix}.studyQuestion`);
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
