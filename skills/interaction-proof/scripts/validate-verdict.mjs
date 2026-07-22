#!/usr/bin/env node

import { readFileSync } from "node:fs";

const reportPath = process.argv[2];
if (!reportPath) {
  process.stderr.write("Usage: validate-verdict.mjs <report.json>\n");
  process.exit(1);
}

let report;
try {
  report = JSON.parse(readFileSync(reportPath, "utf8"));
} catch (error) {
  process.stderr.write(
    `Unable to read report: ${error instanceof Error ? error.message : String(error)}\n`
  );
  process.exit(1);
}

const errors = [];
const statuses = [
  "PASS",
  "FAIL",
  "BLOCKED",
  "NOT_APPLICABLE",
  "HUMAN_STUDY_REQUIRED",
];
const proofLevels = ["SOURCE", "RUN", "DEVICE", "TRACE", "FIELD"];
const runtimeProof = new Set(["RUN", "DEVICE", "TRACE", "FIELD"]);
const claimTypes = new Set(["source", "runtime", "human"]);
const confidences = new Set(["high", "medium", "low"]);
const severities = new Set(["BLOCKER", "HIGH", "MEDIUM", "LOW"]);
const scopes = new Set(["interaction", "surface", "journey", "release"]);

const requireString = (value, path) => {
  if (typeof value !== "string" || value.trim() === "") {
    errors.push(`${path} must be a non-empty string`);
  }
};

if (report.version !== "1.0") {
  errors.push('version must equal "1.0"');
}

if (!report.audit || typeof report.audit !== "object") {
  errors.push("audit must be an object");
} else {
  if (!scopes.has(report.audit.scope)) {
    errors.push("audit.scope must be interaction, surface, journey, or release");
  }
  requireString(report.audit.target, "audit.target");
  if (!proofLevels.includes(report.audit.proofTarget)) {
    errors.push("audit.proofTarget must be a proof ladder value");
  }
}

if (!report.environment || typeof report.environment !== "object") {
  errors.push("environment must be an object");
} else {
  for (const field of ["platform", "device", "osVersion", "buildType", "revision"]) {
    requireString(report.environment[field], `environment.${field}`);
  }
}

if (!Array.isArray(report.ledger) || report.ledger.length === 0) {
  errors.push("ledger must contain at least one claim");
}

const counts = Object.fromEntries(statuses.map((status) => [status, 0]));
const seenIds = new Set();

for (const [index, entry] of (report.ledger ?? []).entries()) {
  const prefix = `ledger[${index}]`;
  requireString(entry.id, `${prefix}.id`);
  if (seenIds.has(entry.id)) {
    errors.push(`${prefix}.id must be unique`);
  }
  seenIds.add(entry.id);

  if (!claimTypes.has(entry.claimType)) {
    errors.push(`${prefix}.claimType must be source, runtime, or human`);
  }
  for (const field of ["claim", "expected", "observed", "environmentId"]) {
    requireString(entry[field], `${prefix}.${field}`);
  }
  if (!statuses.includes(entry.status)) {
    errors.push(`${prefix}.status is invalid`);
  } else {
    counts[entry.status] += 1;
  }
  if (!proofLevels.includes(entry.proofLevel)) {
    errors.push(`${prefix}.proofLevel is invalid`);
  }
  if (!confidences.has(entry.confidence)) {
    errors.push(`${prefix}.confidence must be high, medium, or low`);
  }
  if (!Array.isArray(entry.reproduction) || entry.reproduction.length === 0) {
    errors.push(`${prefix}.reproduction must contain at least one step`);
  }

  if (new Set(["PASS", "FAIL"]).has(entry.status)) {
    if (!Array.isArray(entry.evidence) || entry.evidence.length === 0) {
      errors.push(`${prefix}.evidence is required for ${entry.status}`);
    }
  }
  if (entry.claimType === "runtime" && entry.status === "PASS" && !runtimeProof.has(entry.proofLevel)) {
    errors.push(`${prefix} cannot pass a runtime claim at SOURCE proof`);
  }
  if (entry.claimType === "human" && entry.status !== "HUMAN_STUDY_REQUIRED") {
    errors.push(`${prefix} human claims must use HUMAN_STUDY_REQUIRED`);
  }
  if (entry.status === "FAIL" && !severities.has(entry.severity)) {
    errors.push(`${prefix}.severity is required for failures`);
  }
  if (entry.status === "BLOCKED") {
    requireString(entry.blocker, `${prefix}.blocker`);
  }
  if (entry.status === "NOT_APPLICABLE") {
    requireString(entry.reason, `${prefix}.reason`);
  }
  if (entry.status === "HUMAN_STUDY_REQUIRED") {
    requireString(entry.studyQuestion, `${prefix}.studyQuestion`);
  }
}

if (!report.summary || typeof report.summary !== "object") {
  errors.push("summary must be an object");
} else {
  for (const status of statuses) {
    if (report.summary[status] !== counts[status]) {
      errors.push(`summary.${status} must equal ${counts[status]}`);
    }
  }
}

if (errors.length > 0) {
  process.stderr.write(`INVALID verdict (${errors.length} issue${errors.length === 1 ? "" : "s"})\n`);
  for (const error of errors) {
    process.stderr.write(`- ${error}\n`);
  }
  process.exit(1);
}

process.stdout.write(`VALID verdict (${report.ledger.length} claim${report.ledger.length === 1 ? "" : "s"})\n`);
