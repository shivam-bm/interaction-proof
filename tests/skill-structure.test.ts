import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillRoot = path.join(repositoryRoot, "skills", "interaction-proof");
const skillPath = path.join(skillRoot, "SKILL.md");

test("skill frontmatter is concise, model-invoked, and branch-complete", () => {
  const skill = readFileSync(skillPath, "utf8");
  const frontmatter = skill.match(/^---\n([\s\S]*?)\n---/u)?.[1];
  assert.ok(frontmatter);
  const keys = frontmatter
    .split("\n")
    .filter((line) => /^[a-z][a-z-]*:/u.test(line))
    .map((line) => line.split(":", 1)[0]);
  assert.deepEqual(keys, ["name", "description"]);
  assert.match(frontmatter, /^name: interaction-proof$/mu);
  const description = frontmatter.match(/^description: (.+)$/mu)?.[1];
  assert.ok(description);
  assert.ok(description.length <= 300, `${description.length} characters`);
  for (const branch of ["interaction", "surface", "journey", "release"]) {
    assert.match(description, new RegExp(`\\b${branch}`, "u"));
  }
  assert.doesNotMatch(skill, /TODO/u);
  assert.ok(skill.split("\n").length < 500);
});

test("context pointers resolve and fire at the relevant step", () => {
  const markdownFiles = [
    skillPath,
    ...readdirSync(path.join(skillRoot, "references")).map((file) =>
      path.join(skillRoot, "references", file)
    ),
  ];
  for (const markdownPath of markdownFiles) {
    const markdown = readFileSync(markdownPath, "utf8");
    if (markdown.split("\n").length > 100) {
      assert.match(markdown, /^## Contents$/mu, markdownPath);
    }
    const targets = [...markdown.matchAll(/\]\(([^)]+\.md)\)/gu)].flatMap((match) =>
      match[1] ? [match[1]] : []
    );
    for (const target of targets) {
      assert.equal(existsSync(path.resolve(path.dirname(markdownPath), target)), true, target);
    }
  }

  const skill = readFileSync(skillPath, "utf8");
  assert.ok(skill.indexOf("proof-contract.md") < skill.indexOf("## 1. Frame the proof"));
  assert.ok(skill.indexOf("coverage-ledger.md") > skill.indexOf("## 3. Build the ledger"));
  assert.ok(skill.indexOf("evidence-privacy.md") > skill.indexOf("## 4. Gather proof"));
  assert.ok(skill.indexOf("verdict-format.md") > skill.indexOf("## 6. Issue the verdict"));
  assert.ok(skill.indexOf("regression.md") > skill.indexOf("## 7. Close the loop"));
});

test("every step has one explicit completion criterion", () => {
  const skill = readFileSync(skillPath, "utf8");
  assert.equal([...skill.matchAll(/^## \d+\./gmu)].length, 7);
  assert.equal([...skill.matchAll(/^\*\*Complete when:\*\*/gmu)].length, 7);
});

test("scope definitions have one source of truth", () => {
  const coverage = readFileSync(
    path.join(skillRoot, "references", "coverage-ledger.md"),
    "utf8"
  );
  assert.doesNotMatch(coverage, /^## Scopes$/mu);
  const skill = readFileSync(skillPath, "utf8");
  for (const scope of ["interaction", "surface", "journey", "release"]) {
    assert.match(skill, new RegExp("^- `" + scope + "`:", "mu"));
  }
});

test("agent metadata satisfies interface constraints", () => {
  const metadata = readFileSync(path.join(skillRoot, "agents", "openai.yaml"), "utf8");
  assert.match(metadata, /display_name: "Interaction Proof"/u);
  const shortDescription = metadata.match(/short_description: "([^"]+)"/u)?.[1];
  assert.ok(shortDescription);
  assert.ok(shortDescription.length >= 25 && shortDescription.length <= 64);
  assert.match(metadata, /default_prompt: "Use \$interaction-proof/u);
});

test("required deterministic scripts are present", () => {
  for (const script of [
    "create-ledger.ts",
    "detect-environment.ts",
    "redact-evidence.ts",
    "validate-verdict.ts",
  ]) {
    assert.equal(existsSync(path.join(skillRoot, "scripts", script)), true, script);
  }
});
