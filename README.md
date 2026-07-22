# Interaction Proof

Interaction Proof gives coding agents a predictable process for auditing runtime interaction quality. Every verdict carries proof.

It supports bounded checks of one gesture, full surfaces, multi-screen journeys, and release matrices across Apple platforms, Android, React Native, and Expo. It separates implementation evidence from simulator, device, trace, field, and human-study evidence.

## Install

```bash
npx skills add https://github.com/shivam-bm/interaction-proof --skill interaction-proof
```

Then ask:

```text
Use $interaction-proof to audit this drawer on iOS.
```

## What it audits

- Navigation latency and state restoration
- Drawers, sheets, modals, portals, and focus
- Gestures, interruption, cancellation, and recovery
- Motion, frame hitches, launch, loading, and responsiveness
- Accessibility, adaptive layout, localization, and permission flows
- Offline, repeated, expired, low-resource, and lifecycle states
- Before/after regressions with a pinned protocol

## Proof ladder

```text
SOURCE -> RUN -> DEVICE -> TRACE -> FIELD
```

Runtime passes require runtime evidence. Human questions such as comprehension, trust, comfort, and preference are handed off as `HUMAN_STUDY_REQUIRED`.

## Status

Version `0.1.0` is intended for internal use and public evaluation. Apple platforms and React Native/Expo are the first validation focus. Android guidance is included but should be treated as provisional until equivalent fixture and device coverage is complete.

## Validate

```bash
npm ci
npm test
python3 /path/to/skill-creator/scripts/quick_validate.py skills/interaction-proof
```

The repository type-checks and tests the TypeScript utilities, skill structure, reference pointers, and seeded verdict fixtures. Direct TypeScript execution requires Node.js 22.18 or newer.

## Privacy

Interaction evidence can contain personal data or credentials. Prefer synthetic accounts, collect the smallest artifact that proves the claim, redact before sharing, and declare artifact sensitivity in the report.

## License

MIT
