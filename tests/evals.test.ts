import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

type EvalCase = {
  artifact: string;
  id: string;
  prompt: string;
  scope: string;
};

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("forward-test cases cover every audit branch without answer leakage", () => {
  const cases = JSON.parse(
    readFileSync(path.join(repositoryRoot, "evals", "cases.json"), "utf8")
  ) as EvalCase[];
  assert.deepEqual(
    cases.map(({ scope }) => scope).sort(),
    ["interaction", "journey", "release", "surface"]
  );

  for (const evalCase of cases) {
    assert.match(evalCase.id, /^[a-z0-9-]+$/u);
    assert.match(evalCase.prompt, /Use \$interaction-proof/u);
    assert.match(evalCase.prompt, /structured JSON verdict/u);
    assert.doesNotMatch(evalCase.prompt, /expected answer|must (?:pass|fail|block)/iu);
    assert.equal(existsSync(path.join(repositoryRoot, evalCase.artifact)), true);
  }
});
