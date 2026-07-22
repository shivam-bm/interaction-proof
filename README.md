# Interaction Proof

**Evidence-backed mobile UX audits for coding agents.**

Your app can compile, pass tests, and still feel broken.

Interaction Proof gives coding agents a repeatable way to test how a mobile app actually behaves: navigation, gestures, drawers, sheets, motion, accessibility, interruptions, recovery, and release readiness. Every verdict names the evidence behind it.

[![Validate](https://github.com/shivam-bm/interaction-proof/actions/workflows/validate.yml/badge.svg)](https://github.com/shivam-bm/interaction-proof/actions/workflows/validate.yml)

## Start in 30 seconds

Install the skill:

```bash
npx skills add https://github.com/shivam-bm/interaction-proof --skill interaction-proof
```

Then ask:

```text
Use $interaction-proof to test the whole app end to end.
```

That is enough. The skill discovers the app's screens, routes, journeys, and interaction risks before choosing the right audit depth.

## Why teams use it

- **Catch what code review misses.** Find broken gestures, delayed navigation, presentation bugs, frame hitches, focus failures, and recovery problems at runtime.
- **Audit at any scale.** Test one drawer, an entire journey, or a pre-release matrix with the same evidence model.
- **Avoid false confidence.** Source code can prove implementation. Runtime behavior requires runtime evidence. Missing proof becomes `BLOCKED`, never a guessed `PASS`.
- **Get actionable results.** Every finding identifies the affected flow, environment, reproduction steps, evidence, severity, and next action.
- **Cover real mobile conditions.** Check interruptions, repeated actions, permissions, offline states, lifecycle changes, accessibility settings, and adaptive layouts.

## What the agent does

1. **Maps the experience** — inventories routes, presentation surfaces, gestures, critical journeys, and risky states.
2. **Defines the claims** — turns “the app feels good” into concrete, testable interaction claims.
3. **Pins the environment** — records the build, platform, device or simulator, settings, data state, and protocol.
4. **Collects the strongest available proof** — from source inspection through runtime, physical-device, trace, and field evidence.
5. **Returns an honest verdict** — `PASS`, `FAIL`, `BLOCKED`, or `HUMAN_STUDY_REQUIRED`, with coverage gaps made explicit.

## Choose the audit scope

| Scope | Best for | Example |
| --- | --- | --- |
| Interaction | One bounded behavior | Open, drag, interrupt, and dismiss a drawer |
| Surface | One screen or presentation layer | Audit a profile screen and its sheets |
| Journey | A multi-screen user goal | Complete onboarding and revisit account settings |
| Release | A critical-flow matrix | Test the app across devices, settings, and lifecycle states |

You can name the scope yourself, or use the simple whole-app prompt and let the skill determine it.

## What it tests

### Navigation and presentation

- Route transitions, back behavior, deep links, and state restoration
- Drawers, sheets, modals, portals, overlays, focus, and dismissal
- Loading, empty, error, permission, and expired-session states

### Touch, motion, and responsiveness

- Tap targets, gesture ownership, cancellation, interruption, and recovery
- Reanimated and native motion behavior, continuity, and reduced-motion handling
- Navigation latency, launch responsiveness, frame hitches, and blocked threads

### Accessibility and adaptation

- Screen-reader flow, focus order, labels, actions, and escape behavior
- Dynamic Type, contrast, reduced motion, localization, and right-to-left layouts
- Orientation, split view, safe areas, keyboard behavior, and adaptive layouts

### Resilience and lifecycle

- Offline and degraded-network behavior
- Repeated, rapid, stale, and conflicting actions
- Backgrounding, foregrounding, interruptions, memory pressure, and restoration

## Proof, not opinion

Interaction Proof uses a proof ladder so the strength of a verdict is always visible.

| Level | What it can establish |
| --- | --- |
| `SOURCE` | The implementation, configuration, and intended control flow |
| `RUN` | Observable behavior in a simulator, emulator, preview, or automated runtime |
| `DEVICE` | Behavior on representative physical hardware |
| `TRACE` | Timing, frame, launch, memory, or thread-level performance evidence |
| `FIELD` | Production or field behavior across real users and environments |

A claim only passes when its evidence meets the required level. Questions about comprehension, trust, comfort, or preference are reported as `HUMAN_STUDY_REQUIRED` instead of being invented by the agent.

## What you receive

The final report is designed for engineers, designers, QA, and release owners. It includes:

- An executive verdict and release blockers
- A claim-by-claim evidence ledger
- Reproduction steps and artifact references
- Environment and coverage matrices
- Accessibility and resilience findings
- Unknowns, limitations, and the exact rerun plan

For example:

```text
Verdict: BLOCKED
Target proof: DEVICE
Achieved proof: RUN
Critical blocker: VoiceOver dismissal was not tested on physical hardware.
Next action: Run the pinned protocol on the minimum supported iPhone.
```

## More ways to ask

Audit one interaction:

```text
Use $interaction-proof to audit this drawer on iOS.
```

Audit a journey:

```text
Use $interaction-proof to test the create-lead journey, including errors,
interruptions, accessibility, and recovery.
```

Check a regression:

```text
Use $interaction-proof to compare navigation and animation behavior before
and after this change.
```

Prepare a release:

```text
Use $interaction-proof to audit our critical journeys for release across
supported devices and accessibility settings.
```

## Platforms

Interaction Proof is designed for:

- iOS and iPadOS
- Android
- React Native
- Expo

The workflow is platform-aware: it adapts its checks and evidence requirements to the runtime instead of applying a generic web checklist to mobile software.

## Current status

Version `0.2.0` is standards-ready for internal use and public evaluation. Apple platforms and React Native/Expo are the first runtime-validation focus. Android guidance remains provisional until equivalent physical-device coverage is complete.

## Development

Validate the repository with:

```bash
npm ci
npm test
python3 /path/to/skill-creator/scripts/quick_validate.py skills/interaction-proof
```

The test suite checks the TypeScript utilities, claim contract, proof compatibility, skill structure, reference pointers, seeded verdict fixtures, and forward-test cases for all four audit scopes. Direct TypeScript execution requires Node.js 22.18 or newer.

## Privacy

Interaction evidence can contain personal data or credentials. Prefer synthetic accounts, collect the smallest artifact that proves the claim, redact before sharing, and declare artifact sensitivity in the report.

## License

MIT
