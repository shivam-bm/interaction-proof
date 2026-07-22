#!/usr/bin/env node

type ProofLevel = "SOURCE" | "RUN" | "DEVICE" | "TRACE" | "FIELD";
type Scope = "interaction" | "surface" | "journey" | "release";

type EnvironmentRecord = {
  accessibilitySettings: string;
  appearance: string;
  buildType: string;
  dataState: string;
  device: string;
  id: string;
  locale: string;
  networkState: string;
  osVersion: string;
  platform: string;
  refreshRate: string;
  revision: string;
  riskRationale: string;
};

type StarterClaim = {
  action: string;
  alternative: string;
  cancellation: string;
  claim: string;
  claimType: "runtime";
  completion: string;
  confidence: "low";
  critical: boolean;
  domain: string;
  entryState: string;
  environmentId: string;
  evidence: string[];
  expected: string;
  feedback: string;
  id: string;
  observed: "UNASSESSED";
  person: string;
  proofLevel: "SOURCE";
  proofTarget: ProofLevel;
  recovery: string;
  reproduction: string[];
  status: "UNASSESSED";
  task: string;
};

const args = process.argv.slice(2);

const readArg = (name: string, fallback: string): string => {
  const index = args.indexOf(name);
  return index === -1 ? fallback : (args[index + 1] ?? fallback);
};

const scopes = new Set<Scope>(["interaction", "surface", "journey", "release"]);
const proofLevels = new Set<ProofLevel>(["SOURCE", "RUN", "DEVICE", "TRACE", "FIELD"]);
const scopeArg = readArg("--scope", "interaction");
const surface = readArg("--surface", "Unnamed target");
const platform = readArg("--platform", "unknown");
const person = readArg("--person", "TODO: person or role");
const task = readArg("--task", "TODO: concrete task outcome");
const output = readArg("--output", "json");
const proofTargetArg = readArg("--proof-target", "RUN");

if (!scopes.has(scopeArg as Scope)) {
  process.stderr.write(`Unknown scope: ${scopeArg}\n`);
  process.exit(1);
}

if (!proofLevels.has(proofTargetArg as ProofLevel)) {
  process.stderr.write(`Unknown proof target: ${proofTargetArg}\n`);
  process.exit(1);
}

if (output !== "json" && output !== "markdown") {
  process.stderr.write(`Unknown output: ${output}\n`);
  process.exit(1);
}

const scope = scopeArg as Scope;
const proofTarget = proofTargetArg as ProofLevel;
const environmentId = `${platform}-primary`;
const placeholder = "TODO: replace with observed detail or an explicit non-applicable rationale";

const domains: ReadonlyArray<readonly [string, string]> = [
  ["task", "Task completion and consequence clarity"],
  ["navigation", "Navigation, hierarchy, deep links, and restoration"],
  ["gesture", "Direct manipulation, cancellation, and gesture conflicts"],
  ["motion", "Motion continuity, interruption, and reduced motion"],
  ["responsiveness", "Responsiveness, loading, scrolling, launch, and resume"],
  ["accessibility", "Semantics, focus, text scaling, contrast, and alternative input"],
  ["adaptation", "Layout, orientation, resize, safe areas, and appearance"],
  ["system", "Keyboard, pointer, stylus, permissions, and system presentations"],
  ["feedback", "Visual, audio, and haptic feedback"],
  ["resilience", "Offline, slow, partial, repeated, expired, and low-resource states"],
  ["localization", "Localization, right-to-left layout, and content expansion"],
  ["privacy", "Privacy, permission timing, denial, and sensitive exposure"],
  ["resources", "Memory, energy, thermal, network, storage, and background behavior"],
];

const requestedDomainIds = readArg(
  "--domains",
  domains.map(([domain]) => domain).join(",")
)
  .split(",")
  .map((domain) => domain.trim())
  .filter(Boolean);
const knownDomainIds = new Set(domains.map(([domain]) => domain));
const unknownDomainIds = requestedDomainIds.filter((domain) => !knownDomainIds.has(domain));

if (requestedDomainIds.length === 0) {
  process.stderr.write("At least one domain is required\n");
  process.exit(1);
}

if (unknownDomainIds.length > 0) {
  process.stderr.write(`Unknown domains: ${unknownDomainIds.join(", ")}\n`);
  process.exit(1);
}

const selectedDomainIds = new Set(requestedDomainIds);
const selectedDomains = domains.filter(([domain]) => selectedDomainIds.has(domain));
const excludedDomains = domains
  .filter(([domain]) => !selectedDomainIds.has(domain))
  .map(([domain, title]) => ({
    domain,
    reason: `TODO: state why ${title.toLowerCase()} is out of scope`,
  }));

const environment: EnvironmentRecord = {
  id: environmentId,
  platform,
  device: readArg("--device", "unknown"),
  osVersion: readArg("--os-version", "unknown"),
  buildType: readArg("--build-type", "unknown"),
  revision: readArg("--revision", "unknown"),
  refreshRate: "unknown",
  dataState: "unknown",
  networkState: "unknown",
  locale: "unknown",
  appearance: "unknown",
  accessibilitySettings: "unknown",
  riskRationale: "TODO: state the risk this environment represents",
};

const ledger: StarterClaim[] = selectedDomains.map(([domain, title]) => ({
  id: `${domain}-1`,
  domain,
  claimType: "runtime",
  critical: false,
  person,
  task,
  entryState: placeholder,
  action: placeholder,
  feedback: placeholder,
  completion: placeholder,
  cancellation: placeholder,
  recovery: placeholder,
  alternative: placeholder,
  environmentId,
  claim: `TODO: replace with one falsifiable ${title.toLowerCase()} claim`,
  expected: "TODO: state expected behavior and cite its source",
  observed: "UNASSESSED",
  status: "UNASSESSED",
  proofTarget,
  proofLevel: "SOURCE",
  evidence: [],
  reproduction: [],
  confidence: "low",
}));

const report = {
  version: "1.0",
  audit: {
    scope,
    target: surface,
    proofTarget,
    status: "UNASSESSED",
  },
  environments: [environment],
  ledger,
  coverage: {
    excludedDomains,
    excludedEnvironments: [],
  },
  summary: {
    PASS: 0,
    FAIL: 0,
    BLOCKED: 0,
    NOT_APPLICABLE: 0,
    HUMAN_STUDY_REQUIRED: 0,
    UNASSESSED: ledger.length,
  },
};

if (output === "json") {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exit(0);
}

const escapeCell = (value: unknown): string =>
  String(value).replaceAll("|", "\\|").replaceAll("\n", " ");

process.stdout.write(`# Coverage ledger: ${surface}\n\n`);
process.stdout.write(`- Scope: ${scope}\n- Proof target: ${proofTarget}\n\n`);
process.stdout.write("## Environment\n\n| Field | Value |\n| --- | --- |\n");
for (const [field, value] of Object.entries(environment)) {
  process.stdout.write(`| ${escapeCell(field)} | ${escapeCell(value)} |\n`);
}

if (excludedDomains.length > 0) {
  process.stdout.write("\n## Excluded domains\n\n| Domain | Reason |\n| --- | --- |\n");
  for (const exclusion of excludedDomains) {
    process.stdout.write(
      `| ${escapeCell(exclusion.domain)} | ${escapeCell(exclusion.reason)} |\n`
    );
  }
}

for (const entry of ledger) {
  process.stdout.write(`\n## ${entry.id}: ${entry.domain}\n\n`);
  process.stdout.write("| Field | Value |\n| --- | --- |\n");
  for (const [field, value] of Object.entries(entry)) {
    const displayValue = Array.isArray(value) ? JSON.stringify(value) : value;
    process.stdout.write(`| ${escapeCell(field)} | ${escapeCell(displayValue)} |\n`);
  }
}
