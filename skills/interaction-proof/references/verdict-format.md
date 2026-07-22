# Verdict Format

Lead with the outcome. Keep observation, measurement, and interpretation separate.

## Contents

- Human-readable report
- Structured report

## Human-readable report

1. **Verdict:** overall status and release consequence.
2. **Scope:** person, task, target, exclusions, and revision.
3. **Environment matrix:** platform, device, OS, build, settings, data, network, and tools.
4. **Proof:** requested and achieved rungs by claim.
5. **Findings:** severity-ordered canonical claim records.
6. **Coverage:** outcome counts, omitted-domain rationales, and critical blockers.
7. **Measurements:** protocol, raw samples, and summary statistics.
8. **Human handoffs:** research questions.
9. **Regression plan:** exact rerun protocol.

Use explicit `status`, `proofTarget`, and `proofLevel` labels for every finding; severity alone is not an outcome.

## Structured report

Use the canonical fields from [coverage-ledger.md](coverage-ledger.md):

```json
{
  "version": "1.0",
  "audit": {
    "scope": "interaction",
    "target": "Account drawer open gesture",
    "proofTarget": "DEVICE",
    "status": "PASS"
  },
  "environments": [
    {
      "id": "ios-primary",
      "platform": "ios",
      "device": "iPhone 15 Pro",
      "osVersion": "unknown",
      "buildType": "release",
      "revision": "fixture",
      "refreshRate": "120 Hz",
      "dataState": "seeded account",
      "networkState": "normal",
      "locale": "en-US",
      "appearance": "light",
      "accessibilitySettings": "default",
      "riskRationale": "Primary high-refresh iOS interaction environment"
    }
  ],
  "ledger": [
    {
      "id": "drawer-open-pan",
      "domain": "gesture",
      "claimType": "runtime",
      "critical": true,
      "person": "Signed-in field representative",
      "task": "Open the account drawer",
      "entryState": "Home is interactive and the drawer is closed",
      "action": "Pan from the leading edge",
      "feedback": "The drawer begins tracking the pan",
      "completion": "The drawer settles fully open",
      "cancellation": "Reversing the pan returns the drawer closed",
      "recovery": "A cancelled gesture leaves Home interactive",
      "alternative": "Activate the labeled account button",
      "environmentId": "ios-primary",
      "claim": "The drawer tracks the opening pan continuously.",
      "expected": "The drawer remains attached to the gesture.",
      "observed": "The drawer remained attached in every recorded run.",
      "status": "PASS",
      "proofTarget": "DEVICE",
      "proofLevel": "DEVICE",
      "evidence": ["artifacts/drawer-open.mov"],
      "reproduction": ["Launch the release build", "Open Home", "Pan from the leading edge"],
      "confidence": "high"
    }
  ],
  "coverage": {
    "excludedDomains": [
      { "domain": "task", "reason": "Task outcome is represented by the gesture claim" },
      { "domain": "navigation", "reason": "The interaction does not change routes" },
      { "domain": "motion", "reason": "Motion continuity is represented by the gesture claim" },
      { "domain": "responsiveness", "reason": "No timing budget is in scope" },
      { "domain": "accessibility", "reason": "Accessible activation is represented by alternative input" },
      { "domain": "adaptation", "reason": "The audit targets one fixed layout" },
      { "domain": "system", "reason": "No system presentation is involved" },
      { "domain": "feedback", "reason": "Immediate feedback is represented by the gesture claim" },
      { "domain": "resilience", "reason": "No asynchronous failure state is involved" },
      { "domain": "localization", "reason": "The audit targets en-US" },
      { "domain": "privacy", "reason": "No sensitive content appears" },
      { "domain": "resources", "reason": "Resource behavior is outside this bounded audit" }
    ],
    "excludedEnvironments": [
      { "combination": "Android", "reason": "This bounded audit targets iOS" }
    ]
  },
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

Run `node scripts/validate-verdict.ts <report.json>` before delivery. The validator checks schema, proof compatibility, environment references, critical release blockers, and summary counts; artifact truth still requires inspection.
