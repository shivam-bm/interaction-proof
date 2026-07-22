import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillRoot = path.join(repositoryRoot, "skills", "interaction-proof");
const skillPath = path.join(skillRoot, "SKILL.md");

test("skill frontmatter is model-invoked and minimal", () => {
  const skill = readFileSync(skillPath, "utf8");
  const frontmatter = skill.match(/^---\n([\s\S]*?)\n---/u)?.[1];
  assert.ok(frontmatter);
  const keys = frontmatter
    .split("\n")
    .filter((line) => /^[a-z][a-z-]*:/u.test(line))
    .map((line) => line.split(":", 1)[0]);
  assert.deepEqual(keys, ["name", "description"]);
  assert.match(frontmatter, /^name: interaction-proof$/mu);
  assert.match(frontmatter, /^description: Prove runtime interaction quality/mu);
  assert.doesNotMatch(skill, /TODO/u);
  assert.ok(skill.split("\n").length < 500);
});

test("every local markdown context pointer resolves", () => {
  const skill = readFileSync(skillPath, "utf8");
  const targets = [...skill.matchAll(/\]\(([^)]+\.md)\)/gu)].map((match) => match[1]);
  assert.ok(targets.length >= 8);
  for (const target of targets) {
    assert.equal(existsSync(path.resolve(skillRoot, target)), true, target);
  }
});

test("agent metadata mentions the skill explicitly", () => {
  const metadata = readFileSync(path.join(skillRoot, "agents", "openai.yaml"), "utf8");
  assert.match(metadata, /display_name: "Interaction Proof"/u);
  assert.match(metadata, /default_prompt: "Use \$interaction-proof/u);
});

test("required deterministic scripts are present", () => {
  for (const script of [
    "create-ledger.mjs",
    "detect-environment.mjs",
    "redact-evidence.mjs",
    "validate-verdict.mjs",
  ]) {
    assert.equal(existsSync(path.join(skillRoot, "scripts", script)), true, script);
  }
});
