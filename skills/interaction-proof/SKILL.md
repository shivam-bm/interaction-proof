---
name: interaction-proof
description: Prove runtime interaction quality with a coverage ledger and evidence-backed verdicts. Use for mobile navigation latency, gestures, drawers, sheets, modals, motion, accessibility paths, responsiveness regressions, or pre-release journeys on Apple, Android, React Native, and Expo; use when another design or review skill needs observed behavior instead of code-only advice.
---

# Interaction Proof

Every verdict carries **proof**. Follow the same process whether the target is one gesture or an entire release. Vary the evidence, never the method.

## Proof ladder

Use the strongest available rung and name it in every claim:

`SOURCE -> RUN -> DEVICE -> TRACE -> FIELD`

- `SOURCE`: implementation, configuration, or installed-source evidence.
- `RUN`: reproduced in a simulator or emulator.
- `DEVICE`: reproduced in a release-like build on physical hardware.
- `TRACE`: backed by a profiler, frame trace, performance metric, or native diagnostic.
- `FIELD`: backed by production telemetry, organizer metrics, crash reports, or a human study.

Match the verdict to the rung. A source inspection can prove what code does, not how a gesture feels on hardware. Read [proof-contract.md](references/proof-contract.md) before issuing findings.

## Select the branch

Choose one audit scope:

- `interaction`: one transition, gesture, control, animation, or feedback loop.
- `surface`: one screen, drawer, sheet, modal, or navigation region.
- `journey`: a task spanning multiple surfaces.
- `release`: the risk-based platform, device, state, and accessibility matrix.

Load only the references the branch requires:

- Always read [coverage-ledger.md](references/coverage-ledger.md) and [verdict-format.md](references/verdict-format.md).
- For timing, motion, launch, scrolling, or resource claims, read [measurement.md](references/measurement.md).
- For iOS or iPadOS, SwiftUI, UIKit, Xcode, Instruments, or Apple conventions, read [apple-platforms.md](references/apple-platforms.md).
- For Android platform behavior or tooling, read [android-platforms.md](references/android-platforms.md).
- For React Native or Expo, also read [react-native.md](references/react-native.md) plus the target platform reference.
- Before capturing logs, screenshots, recordings, or production evidence, read [evidence-privacy.md](references/evidence-privacy.md).
- For before/after work or an approved fix, read [regression.md](references/regression.md).

## 1. Frame the proof

State the person, task, target, expected behavior, boundaries, and requested scope. Separate observable claims from questions that require people. Preserve read-only mode unless the user requests implementation.

**Complete when:** every requested interaction is named, the expected behavior has a source or is marked as an assumption, and every human-dependent question is labeled `HUMAN_STUDY_REQUIRED`.

## 2. Pin the environment

Record the code revision, app version, framework versions, platform, OS, device, build type, refresh rate, data state, network state, locale, appearance, and accessibility settings. Run `node scripts/detect-environment.ts --root <target>` for file-backed stack detection; add `--probe-tools` only when local tool versions matter.

Choose the target proof rung before testing. Record unavailable tools or hardware as blockers.

**Complete when:** every environment field has a value or `unknown`, the target proof rung is explicit, and missing prerequisites are visible.

## 3. Build the ledger

Run `node scripts/create-ledger.ts --scope <scope> --surface <name> --platform <platform> --output markdown` as a starting point. Replace generic rows with the real interactions and states in scope. Select device and state combinations by risk, not convenience.

**Complete when:** every in-scope interaction has an entry state, action, feedback, completion, cancellation, recovery, accessibility alternative, and applicable environment conditions—or an explicit reason that a field does not apply.

## 4. Gather proof

Inspect the real implementation and installed dependency source before theorizing. Exercise the interaction with the safest available runtime. Capture the smallest artifact that proves or disproves each claim. Repeat measurements under a pinned protocol. Keep content-ready time separate from transition animation time.

Prefer synthetic accounts and redact evidence before saving or sharing it.

**Complete when:** every ledger row has observed evidence at the claimed rung or a concrete blocker; no runtime pass rests on source evidence alone. Run `node scripts/redact-evidence.ts <artifact>` before sharing text evidence that may contain secrets or personal data.

## 5. Stress the interaction

Exercise interruption and recovery: repeat taps, slow drag, fast fling, reversal, cancellation, background and foreground, rotation or resize, keyboard presence, permission denial, slow network, offline state, large content, large text, reduced motion, and assistive technology where applicable.

For a release scope, include the oldest supported environment, smallest layout, largest supported text, representative 60 Hz and high-refresh hardware, and the primary tablet or adaptive configuration.

**Complete when:** every selected risk condition has a ledger outcome of `PASS`, `FAIL`, `BLOCKED`, `NOT_APPLICABLE`, or `HUMAN_STUDY_REQUIRED`.

## 6. Issue the verdict

Write the report using [verdict-format.md](references/verdict-format.md). Grade severity from impact, reach, reproducibility, and confidence. Keep measurements and interpretation distinct. Run `node scripts/validate-verdict.ts <report.json>` for structured reports.

**Complete when:** every verdict names its proof rung and artifact, every failure is reproducible, every blocker names what would unblock it, the structured report validates, and no claim exceeds its evidence.

## 7. Close the loop

When the user requests a fix, preserve the baseline, make the smallest authorized change, repeat the identical protocol, and exercise adjacent interactions. When the request is an audit, stop at findings and the verification plan.

**Complete when:** each original claim is closed by stronger proof, remains an explicit blocker, or is handed to a human study; regressions are reported separately from unresolved baseline failures.
