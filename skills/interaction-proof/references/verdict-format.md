# Verdict Format

Lead with the outcome. Keep observation, measurement, and interpretation separate.

## Human-readable report

1. **Scope:** person, task, target, exclusions, revision.
2. **Environment:** platform, device, OS, build, settings, data, network, tools.
3. **Proof target:** requested and achieved rung.
4. **Verdict:** release decision or bounded interaction outcome.
5. **Findings:** severity-ordered claim records.
6. **Coverage:** ledger counts and blocked critical rows.
7. **Measurements:** protocol, raw sample location, summary statistics.
8. **Human handoffs:** questions requiring research.
9. **Regression plan:** exact rerun protocol.

## Structured report

Use JSON with this shape:

```json
{
  "version": "1.0",
  "audit": {
    "scope": "interaction",
    "target": "Account drawer open gesture",
    "proofTarget": "DEVICE"
  },
  "environment": {
    "platform": "ios",
    "device": "iPhone 15 Pro",
    "osVersion": "unknown",
    "buildType": "release",
    "revision": "unknown"
  },
  "ledger": [
    {
      "id": "drawer-open-pan",
      "claimType": "runtime",
      "claim": "The drawer tracks the opening pan without a visible hitch.",
      "expected": "The drawer remains attached to the gesture.",
      "observed": "The drawer remained attached in all recorded runs.",
      "status": "PASS",
      "proofLevel": "DEVICE",
      "environmentId": "ios-primary",
      "evidence": ["artifacts/drawer-open.mov"],
      "reproduction": ["Launch the release build", "Open Home", "Pan from the leading edge"],
      "confidence": "high"
    }
  ],
  "summary": {
    "PASS": 1,
    "FAIL": 0,
    "BLOCKED": 0,
    "NOT_APPLICABLE": 0,
    "HUMAN_STUDY_REQUIRED": 0
  }
}
```

For `FAIL`, add `severity`. For `BLOCKED`, add `blocker`. For `NOT_APPLICABLE`, add `reason`. For `HUMAN_STUDY_REQUIRED`, add `studyQuestion`.

Run `node scripts/validate-verdict.ts <report.json>` before delivery. The validator checks evidence/outcome compatibility and summary counts; it does not certify that an artifact is truthful.
