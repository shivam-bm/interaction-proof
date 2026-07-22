---
name: interaction-proof
description: Prove mobile interaction quality with evidence-backed audits. Use for a single interaction, a screen or presentation surface, a multi-screen journey, or a pre-release matrix on Apple, Android, React Native, and Expo; also use when design or code review needs observed runtime behavior.
---

# Interaction Proof

Every verdict carries **proof**. Scale the ledger from one gesture to an entire release while preserving the method and raising the evidence rung with risk.

## Proof ladder

Name one rung in every claim:

`SOURCE -> RUN -> DEVICE -> TRACE -> FIELD`

- `SOURCE`: implementation, configuration, or installed-source evidence.
- `RUN`: reproduction in a simulator or emulator.
- `DEVICE`: reproduction in a release-like build on physical hardware.
- `TRACE`: profiler, frame trace, performance metric, or native diagnostic evidence.
- `FIELD`: production telemetry, organizer metrics, crash reports, or human-study evidence.

Match each verdict to its rung. Read [proof-contract.md](references/proof-contract.md) before framing claims or selecting outcomes; it is the single source of truth for evidence compatibility.

## Select the branch

Choose one scope:

- `interaction`: one transition, gesture, control, animation, or feedback loop.
- `surface`: one screen, drawer, sheet, modal, or navigation region.
- `journey`: one task spanning multiple surfaces.
- `release`: a risk-based platform, device, state, and accessibility matrix.

Load only branch-specific references:

- For timing, motion, launch, scrolling, or resource claims, read [measurement.md](references/measurement.md) before setting the protocol.
- For iOS, iPadOS, SwiftUI, UIKit, Xcode, Instruments, or Apple conventions, read [apple-platforms.md](references/apple-platforms.md).
- For Android behavior or tooling, read [android-platforms.md](references/android-platforms.md).
- For React Native or Expo, read [react-native.md](references/react-native.md) plus the target platform reference.

## 1. Frame the proof

State the person, task, target, expected behavior, boundaries, and scope. Separate observable claims from human questions. Match authority to the request: audits end at findings; implementation begins only when requested.

**Complete when:** every requested interaction is named, expected behavior has a source or an explicit assumption, and every human-dependent question is labeled `HUMAN_STUDY_REQUIRED`.

## 2. Pin the environment

Record the code revision, app version, framework versions, platform, OS, device, build type, refresh rate, data state, network state, locale, appearance, and accessibility settings. Run `node scripts/detect-environment.ts --root <target>` for file-backed detection; add `--probe-tools` only when local tool versions matter.

Choose the target proof rung. Record unavailable tools or hardware as blockers.

**Complete when:** every environment field has a value or `unknown`, the target rung is explicit, and every missing prerequisite is visible.

## 3. Build the ledger

Read [coverage-ledger.md](references/coverage-ledger.md). Run `node scripts/create-ledger.ts --scope <scope> --surface <name> --platform <platform> --person <person> --task <task> --domains <comma-separated-domain-ids> --output markdown`. Replace domain starters with decision-bearing claims and risk-based environments; the generator seeds exclusions for unselected domains.

**Complete when:** every in-scope claim records entry, action, feedback, completion, cancellation, recovery, alternative input, environment, expectation, and proof target; every excluded domain or environment has a rationale.

## 4. Gather proof

Inspect the implementation and installed dependency source first. Exercise the safest available runtime. Capture the smallest artifact that settles each claim. For logs, screenshots, recordings, or production evidence, read [evidence-privacy.md](references/evidence-privacy.md) before capture. Repeat measurements under the pinned protocol and keep content-ready time separate from transition duration.

Runtime `PASS` and `FAIL` outcomes rest on `RUN` or stronger evidence. Run `node scripts/redact-evidence.ts <artifact>` before sharing text evidence that may contain secrets or personal data.

**Complete when:** every ledger record has evidence at the claimed rung or a concrete blocker, and every resolved claim meets its proof target.

## 5. Stress the interaction

Exercise interruption and recovery: repeat taps, slow drag, fast fling, reversal, cancellation, background and foreground, rotation or resize, keyboard presence, permission denial, slow network, offline state, large content, large text, reduced motion, and assistive technology where applicable.

For a release scope, include the oldest supported environment, smallest layout, largest supported text, representative 60 Hz and high-refresh hardware, and the primary tablet or adaptive configuration.

**Complete when:** every selected risk condition has an outcome of `PASS`, `FAIL`, `BLOCKED`, `NOT_APPLICABLE`, or `HUMAN_STUDY_REQUIRED`.

## 6. Issue the verdict

Read [verdict-format.md](references/verdict-format.md). Grade severity from impact, reach, reproducibility, and confidence. Keep observation, measurement, and interpretation separate. Run `node scripts/validate-verdict.ts <report.json>` for structured reports.

**Complete when:** every claim names its status, target rung, achieved rung, environment, and artifact; every failure is reproducible; every blocker names its remedy; the summary matches the ledger; and the structured report validates.

## 7. Close the loop

For a requested fix or before/after comparison, read [regression.md](references/regression.md), preserve the baseline, make the smallest authorized change, repeat the identical protocol, and exercise adjacent interactions. For an audit, deliver findings and the exact verification plan.

**Complete when:** every original claim is closed at equal or stronger proof, remains an explicit blocker, or becomes a human-study handoff; regressions remain separate from baseline failures.
