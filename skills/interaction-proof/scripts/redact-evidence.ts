#!/usr/bin/env node

import { readFileSync } from "node:fs";

const filePath = process.argv[2];
const input = filePath
  ? readFileSync(filePath, "utf8")
  : readFileSync(process.stdin.fd, "utf8");

const rules: ReadonlyArray<readonly [RegExp, string]> = [
  [/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/giu, "[REDACTED_EMAIL]"],
  [/\bAKIA[0-9A-Z]{16}\b/gu, "[REDACTED_AWS_ACCESS_KEY]"],
  [/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/gu, "[REDACTED_JWT]"],
  [/\bBearer\s+[A-Za-z0-9._~+/=-]+/giu, "Bearer [REDACTED_TOKEN]"],
  [
    /((?:api[_-]?key|access[_-]?token|refresh[_-]?token|client[_-]?secret|authorization|cookie)\s*[=:]\s*["']?)[^\s,"'}]+/giu,
    "$1[REDACTED_SECRET]",
  ],
  [
    /([?&](?:token|key|secret|signature|code)=)[^&#\s]+/giu,
    "$1[REDACTED_SECRET]",
  ],
];

let output = input;
for (const [pattern, replacement] of rules) {
  output = output.replace(pattern, replacement);
}

process.stdout.write(output);
