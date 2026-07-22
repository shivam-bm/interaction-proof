#!/usr/bin/env node

const args = process.argv.slice(2);

const readArg = (name: string, fallback: string): string => {
  const index = args.indexOf(name);
  return index === -1 ? fallback : (args[index + 1] ?? fallback);
};

const scopes = new Set(["interaction", "surface", "journey", "release"]);
const proofLevels = new Set(["SOURCE", "RUN", "DEVICE", "TRACE", "FIELD"]);
const scope = readArg("--scope", "interaction");
const surface = readArg("--surface", "Unnamed target");
const platform = readArg("--platform", "unknown");
const output = readArg("--output", "json");
const proofTarget = readArg("--proof-target", "RUN");

if (!scopes.has(scope)) {
  process.stderr.write(`Unknown scope: ${scope}\n`);
  process.exit(1);
}

if (!proofLevels.has(proofTarget)) {
  process.stderr.write(`Unknown proof target: ${proofTarget}\n`);
  process.exit(1);
}

if (!new Set(["json", "markdown"]).has(output)) {
  process.stderr.write(`Unknown output: ${output}\n`);
  process.exit(1);
}

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

const ledger = domains.map(([id, claim]) => ({
  id,
  claim,
  status: "UNASSESSED",
  proofTarget,
  notes: "Replace this domain row with concrete interactions or explain why it does not apply.",
}));

if (output === "json") {
  process.stdout.write(
    `${JSON.stringify({ version: "1.0", scope, surface, platform, ledger }, null, 2)}\n`
  );
  process.exit(0);
}

const escapeCell = (value: string): string => value.replaceAll("|", "\\|");
const rows = ledger
  .map(
    (entry) =>
      `| ${escapeCell(entry.id)} | ${escapeCell(entry.claim)} | ${entry.status} | ${entry.proofTarget} | ${escapeCell(entry.notes)} |`
  )
  .join("\n");

process.stdout.write(`# Coverage ledger: ${surface}\n\n`);
process.stdout.write(`- Scope: ${scope}\n- Platform: ${platform}\n\n`);
process.stdout.write("| ID | Claim | Status | Proof target | Notes |\n");
process.stdout.write("| --- | --- | --- | --- | --- |\n");
process.stdout.write(`${rows}\n`);
